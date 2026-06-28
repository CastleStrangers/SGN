import { prisma } from './src/lib/db';
import * as fs from 'fs';
async function main() {
  const members = await prisma.boardMember.findMany();
  fs.writeFileSync('members.json', JSON.stringify(members.map(m => ({ ar: m.nameAr, en: m.nameEn })), null, 2), 'utf8');
  console.log('Done');
}
main().catch(console.error);