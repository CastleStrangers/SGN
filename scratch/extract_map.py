import re
import json

content_path = r'C:\Users\msali\.gemini\antigravity-ide\brain\4e1c5917-ee12-4d90-b5ef-abbe91f0588e\.system_generated\steps\362\content.md'
with open(content_path, 'r', encoding='utf-8') as f:
    content = f.read()

path_regex = re.compile(r'<path\s+([^>]+)>', re.IGNORECASE)
provinces = {}

names = [
    'Groningen', 'Friesland', 'Drenthe', 'Overijssel', 'Flevoland', 
    'Gelderland', 'Utrecht', 'Noord-Holland', 'Zuid-Holland', 
    'Zeeland', 'Noord-Brabant', 'Limburg'
]

for match in path_regex.finditer(content):
    attrs = match.group(1)
    
    class_match = re.search(r'class="([^"]+)"', attrs, re.IGNORECASE)
    d_match = re.search(r'd="([^"]+)"', attrs, re.IGNORECASE)
    id_match = re.search(r'id="([^"]+)"', attrs, re.IGNORECASE)
    
    if class_match and d_match:
        class_name = class_match.group(1)
        d_val = d_match.group(1)
        path_id = id_match.group(1) if id_match else None
        
        province_name = None
        for name in names:
            if name.lower() in class_name.lower():
                province_name = name
                break
                
        if province_name:
            if province_name not in provinces:
                provinces[province_name] = []
            provinces[province_name].append({
                'id': path_id,
                'className': class_name,
                'd': d_val
            })

print('Extracted Provinces keys:', list(provinces.keys()))
with open(r'scratch/extracted_provinces.json', 'w', encoding='utf-8') as f:
    json.dump(provinces, f, indent=2)
print('Saved to scratch/extracted_provinces.json')
