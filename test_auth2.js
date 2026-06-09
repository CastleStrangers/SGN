process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.NODE_ENV = 'production';
process.env.DATABASE_URL = 'file:./prisma/dev.db';

const { PrismaAdapter } = require('@next-auth/prisma-adapter');
const { PrismaClient } = require('.prisma/client');
const NextAuth = require('next-auth').default;

async function main() {
  try {
    const prisma = new PrismaClient();
    const adapter = PrismaAdapter(prisma);
    
    const handler = NextAuth({
      adapter,
      session: { strategy: 'jwt' },
      providers: [],
      secret: 'super-secret-key-change-in-production'
    });
    
    console.log('Handler created:', typeof handler);
    
    // Try to simulate a CSRF request
    const req = new Request('http://localhost:3000/api/auth/csrf');
    const resp = await handler(req, { params: { nextauth: ['csrf'] } });
    console.log('Response status:', resp.status);
    const body = await resp.text();
    console.log('Response body:', body.substring(0, 500));
    
    await prisma.$disconnect();
  } catch(e) {
    console.log('ERROR:', e.message);
    console.log('STACK:', e.stack?.substring(0, 500));
  }
}
main();
