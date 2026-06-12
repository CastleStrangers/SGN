import { put } from '@vercel/blob';
import { readFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error('BLOB_READ_WRITE_TOKEN not found in .env.local');
  process.exit(1);
}

const imagesDir = join(import.meta.dirname, '..', 'public', 'images', 'board');
const files = readdirSync(imagesDir);

console.log(`Found ${files.length} files in ${imagesDir}`);

const results = [];

for (const file of files) {
  const ext = extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp', '.svg'].includes(ext)) continue;
  
  const content = readFileSync(join(imagesDir, file));
  const blob = await put(`board/uploaded/${file}`, content, {
    access: 'public',
    token,
    contentType: ext === '.svg' ? 'image/svg+xml' : `image/${ext.slice(1)}`,
  });
  
  results.push({ file, url: blob.url });
  console.log(`  ✓ ${file} → ${blob.url}`);
}

console.log(`\nUploaded ${results.length}/${files.length} files`);
