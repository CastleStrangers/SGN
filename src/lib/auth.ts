import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AzureADProvider from "next-auth/providers/azure-ad";
import AppleProvider from "next-auth/providers/apple";
import { prisma } from "./db";
import bcrypt from "bcryptjs";
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      // المزامنة: نطلب صورة المستخدم من Google
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      tenantId: process.env.AZURE_AD_TENANT_ID || "common",
      allowDangerousEmailAccountLinking: true,
    }),

    AppleProvider({
      clientId: process.env.APPLE_ID || "",
      clientSecret: process.env.APPLE_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

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
    // المزامنة: ربط بيانات المستخدم الاجتماعي بقاعدة البيانات
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
            // تحديث صورة المستخدم إذا كانت فارغة
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

    // إضافة بيانات إضافية لـ JWT Token
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "member";
        token.image = user.image;
      }
      // عند الدخول عبر OAuth، نحفظ نوع المزود
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },

    // إضافة بيانات إضافية للـ Session
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
