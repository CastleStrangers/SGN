import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AzureADProvider from "next-auth/providers/azure-ad";
import AppleProvider from "next-auth/providers/apple";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

// Rate limiting helper
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

const isRateLimited = (identifier: string): boolean => {
  const attempt = loginAttempts.get(identifier);
  if (!attempt) return false;

  if (Date.now() > attempt.resetTime) {
    loginAttempts.delete(identifier);
    return false;
  }

  return attempt.count >= MAX_ATTEMPTS;
};

const recordLoginAttempt = (identifier: string) => {
  const attempt = loginAttempts.get(identifier);
  if (!attempt) {
    loginAttempts.set(identifier, {
      count: 1,
      resetTime: Date.now() + LOCKOUT_DURATION,
    });
  } else {
    attempt.count++;
  }
};

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
    error: "/login",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID ? [GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: false,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    })] : []),

    ...(process.env.FACEBOOK_CLIENT_ID ? [FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: false,
    })] : []),

    ...(process.env.AZURE_AD_CLIENT_ID ? [AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID || "common",
      allowDangerousEmailAccountLinking: false,
    })] : []),

    ...(process.env.APPLE_ID ? [AppleProvider({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
      allowDangerousEmailAccountLinking: false,
    })] : []),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials?.email || !credentials?.password) return null;

        // Check rate limiting
        if (isRateLimited(credentials.email)) {
          console.warn(`[Auth] Rate limit exceeded for ${credentials.email}`);
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          recordLoginAttempt(credentials.email);
          return null;
        }

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) {
          recordLoginAttempt(credentials.email);
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (
        account?.provider === "google" ||
        account?.provider === "facebook" ||
        account?.provider === "azure-ad" ||
        account?.provider === "apple"
      ) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (existingUser) {
            if (!existingUser.image && user.image) {
              await prisma.user.update({
                where: { email: user.email! },
                data: { image: user.image },
              });
            }
          }
        } catch (error) {
          console.error("[Auth] signIn callback error:", error);
        }
      }
      return true;
    },

    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "member";
        token.image = user.image;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).provider = token.provider;
        if (token.image && !session.user.image) {
          session.user.image = token.image as string;
        }
      }
      return session;
    },
  },
};
