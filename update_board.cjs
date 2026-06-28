const fs = require('fs');
const filepath = 'src/app/api/board/route.ts';
let content = fs.readFileSync(filepath, 'utf8');
const target = 'return NextResponse.json(parsedMembers, { status: 200 });';
const replacement = `const orderedNames = [
      "Abdul Munim Al Chaman",
      "Saleh Al Mohamad",
      "Khaled Faisal Altawil",
      "Mohamad Salim Aziza",
      "Mohamad Raed Kaakeh",
      "Ahmad Alharfi",
      "Huda Alhallak",
      "Raid Dahmoush",
      "Mahmoud AlNaser",
      "Omar Al Nwilati",
      "Rabaa Al-Zreqat",
      "Faten Rahhal",
      "Hasan Alhasan (Qutaini)",
      "Nabil Haj Hussein",
      "Belal Alrefai",
      "Mohammad Semhani",
      "Nehad Sowid",
      "Mohamad Akram Aljnidi",
      "Youssef Darwesh",
      "Mohammed Rabe Aljnidi",
      "Wassim Hassan",
      "Mahera Al Tawashi",
      "Rima Alhrbat",
      "Feras Abdin"
    ];

    parsedMembers.sort((a, b) => {
      const idxA = orderedNames.indexOf(a.nameEn);
      const idxB = orderedNames.indexOf(b.nameEn);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });

    return NextResponse.json(parsedMembers, { status: 200 });`;
if (content.includes(target)) {
  fs.writeFileSync(filepath, content.replace(target, replacement), 'utf8');
  console.log('Successfully updated src/app/api/board/route.ts');
} else {
  console.log('Target string not found');
}