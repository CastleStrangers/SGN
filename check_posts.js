const { PrismaClient } = require('.prisma/client');
const p = new PrismaClient();
p.post.count().then(c => {
  console.log('Post count:', c);
  return p.$disconnect();
}).catch(e => { console.log(e); return p.$disconnect(); });
