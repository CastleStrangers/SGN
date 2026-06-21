const fs = require('fs');
const path = require('path');

const boardDir = path.join(__dirname, '..', 'public', 'images', 'board');

// خريطة الأعضاء: اسم الملف → الحرف الأول + لون خلفية
const members = [
  { file: 'abdulmunim.svg', letter: 'ع', color: '#1a5632' },
  { file: 'saleh.svg',      letter: 'ص', color: '#1a5632' },
  { file: 'khaled.svg',     letter: 'خ', color: '#1a5632' },
  { file: 'nehad.svg',      letter: 'ن', color: '#2d6a4f' },
  { file: 'samhani.svg',    letter: 'م', color: '#2d6a4f' },
  { file: 'dahmoush.svg',   letter: 'ر', color: '#2d6a4f' },
  { file: 'naser.svg',      letter: 'م', color: '#2d6a4f' },
  { file: 'huda.svg',       letter: 'ه', color: '#74512d' },
  { file: 'omar.svg',       letter: 'م', color: '#2d6a4f' },
  { file: 'qutaini.svg',    letter: 'ح', color: '#2d6a4f' },
  { file: 'rabaa.svg',      letter: 'ر', color: '#74512d' },
  { file: 'akram.svg',      letter: 'م', color: '#2d6a4f' },
  { file: 'nabil.svg',      letter: 'ن', color: '#2d6a4f' },
  { file: 'belal.svg',      letter: 'ب', color: '#2d6a4f' },
  { file: 'faten.svg',      letter: 'ف', color: '#74512d' },
  { file: 'feras.svg',      letter: 'ف', color: '#1a5632' },
  { file: 'raed.svg',       letter: 'م', color: '#1a5632' },
  { file: 'rabe.svg',       letter: 'م', color: '#1a5632' },
  { file: 'mahera.svg',     letter: 'م', color: '#74512d' },
  { file: 'wassim.svg',     letter: 'و', color: '#1a5632' },
  { file: 'youssef.svg',    letter: 'ي', color: '#2d6a4f' },
  { file: 'rima.svg',       letter: 'ر', color: '#74512d' },
  { file: 'alharfi.svg',    letter: 'أ', color: '#1a5632' },
];

let updated = 0;

for (const m of members) {
  const filePath = path.join(boardDir, m.file);
  
  // SVG مربع 200×200 مع تدرج لوني وحرف أوسط
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${m.color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a2e1a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#g)"/>
  <text x="100" y="130" text-anchor="middle" fill="white" font-size="90" font-weight="bold" font-family="Arial, sans-serif" opacity="0.9">${m.letter}</text>
</svg>`;

  fs.writeFileSync(filePath, svg, 'utf8');
  updated++;
  console.log(`✓ ${m.file}`);
}

console.log(`\n✅ تم تحديث ${updated} ملف SVG`);
