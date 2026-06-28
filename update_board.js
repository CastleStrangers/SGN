const fs = require('fs');
const filepath = 'src/app/api/board/route.ts';
let content = fs.readFileSync(filepath, 'utf8');
const target = 'return NextResponse.json(parsedMembers, { status: 200 });';
const replacement = `const orderedNames = [
      "عبد المنعم الشامان",
      "صالح المحمد حنايا",
      "خالد فيصل الطويل",
      "محمد سليم عزيزة",
      "محمد رائد كعكة",
      "أحمد الحرفي",
      "هدى الحلاق",
      "رائد دهموش المشهور",
      "محمود الناصر",
      "محمد عمر النويلاتي",
      "رابعة الزريقات",
      "فاتن رحال",
      "حسن الحسن قطيني",
      "نبيل حاج حسين",
      "بلال الرفاعي",
      "محمد مصطفى سمهاني",
      "نهاد سويد",
      "محمد أكرم الجنيدي",
      "يوسف درويش",
      "محمد ربيع الجنيدي",
      "وسيم حسان",
      "ماهره الطواشي",
      "ريمه الحربات",
      "فراس هاني عابدين"
    ];

    parsedMembers.sort((a, b) => {
      const idxA = orderedNames.indexOf(a.nameAr);
      const idxB = orderedNames.indexOf(b.nameAr);
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