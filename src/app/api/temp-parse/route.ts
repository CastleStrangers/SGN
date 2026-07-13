import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const contentPath = 'C:\\Users\\msali\\.gemini\\antigravity-ide\\brain\\4e1c5917-ee12-4d90-b5ef-abbe91f0588e\\.system_generated\\steps\\362\\content.md';
    const content = fs.readFileSync(contentPath, 'utf8');

    const pathRegex = /<path\s+([^>]+)>/gi;
    let match;
    const provinces: Record<string, string[]> = {};

    const names = [
      'Groningen', 'Friesland', 'Drenthe', 'Overijssel', 'Flevoland', 
      'Gelderland', 'Utrecht', 'Noord-Holland', 'Zuid-Holland', 
      'Zeeland', 'Noord-Brabant', 'Limburg'
    ];

    while ((match = pathRegex.exec(content)) !== null) {
      const attrs = match[1];
      
      const classMatch = /class="([^"]+)"/i.exec(attrs);
      const dMatch = /d="([^"]+)"/i.exec(attrs);
      
      if (classMatch && dMatch) {
        const className = classMatch[1];
        const dVal = dMatch[1];
        
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
          provinces[provinceName].push(dVal);
        }
      }
    }

    // Write to public/ netherlands-map-paths.json
    const outputPath = path.join(process.cwd(), 'public', 'netherlands-map-paths.json');
    fs.writeFileSync(outputPath, JSON.stringify(provinces, null, 2));

    return NextResponse.json({ success: true, keys: Object.keys(provinces), outputPath });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
