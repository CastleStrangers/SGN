process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.NODE_ENV = 'production';
process.env.DATABASE_URL = 'file:./prisma/dev.db';

const { PrismaAdapter } = require('@next-auth/prisma-adapter');
const { PrismaClient } = require('.prisma/client');

async function main() {
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log('DB connected successfully');
    
    const adapter = PrismaAdapter(prisma);
    console.log('PrismaAdapter created:', typeof adapter);
    console.log('Adapter keys:', Object.keys(adapter));
    
    await prisma.$disconnect();
    console.log('All OK!');
  } catch (e) {
    console.log('ERROR:', e.message?.substring(0, 500));
    console.log('STACK:', e.stack?.substring(0, 500));
  }
}
main();
