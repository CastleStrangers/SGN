const fs = require('fs');
const path = require('path');

const contentPath = 'C:\\Users\\msali\\.gemini\\antigravity-ide\\brain\\4e1c5917-ee12-4d90-b5ef-abbe91f0588e\\.system_generated\\steps\\362\\content.md';
const content = fs.readFileSync(contentPath, 'utf8');

const pathRegex = /<path\s+([^>]+)>/gi;
let match;
const provinces = {};

while ((match = pathRegex.exec(content)) !== null) {
  const attrs = match[1];
  
  const classMatch = /class="([^"]+)"/i.exec(attrs);
  const dMatch = /d="([^"]+)"/i.exec(attrs);
  const idMatch = /id="([^"]+)"/i.exec(attrs);
  
  if (classMatch && dMatch) {
    const className = classMatch[1];
    const dVal = dMatch[1];
    
    const names = [
      'Groningen', 'Friesland', 'Drenthe', 'Overijssel', 'Flevoland', 
      'Gelderland', 'Utrecht', 'Noord-Holland', 'Zuid-Holland', 
      'Zeeland', 'Noord-Brabant', 'Limburg'
    ];
    
    let provinceName = null;
    for (const name of names) {
      if (className.toLowerCase().includes(name.toLowerCase())) {
        provinceName = name;
        break;
      }
    }
    
    if (provinceName) {
      if (!provinces[provinceName]) {
        provinces[provinceName] = [];
      }
      provinces[provinceName].push({
        id: idMatch ? idMatch[1] : undefined,
        className,
        d: dVal
      });
    }
  }
}

console.log('Extracted Provinces keys:', Object.keys(provinces));
fs.writeFileSync('scratch/extracted_provinces.json', JSON.stringify(provinces, null, 2));
console.log('Saved to scratch/extracted_provinces.json');
