const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
prisma.boardMember.findMany().then(members => {
  fs.writeFileSync('members.json', JSON.stringify(members.map(m => ({ ar: m.nameAr, en: m.nameEn })), null, 2), 'utf8');
  console.log('Done');
});