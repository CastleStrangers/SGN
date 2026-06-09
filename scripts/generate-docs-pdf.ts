import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  bufferPages: true,
});

const outputPath = path.join(process.cwd(), 'PROJECT_DOCUMENTATION.pdf');
const stream = fs.createWriteStream(outputPath);

doc.pipe(stream);

// Read the markdown file
const markdownPath = path.join(process.cwd(), 'PROJECT_DOCUMENTATION.md');
const markdownContent = fs.readFileSync(markdownPath, 'utf-8');

// Add title page
doc.fontSize(24).font('Helvetica-Bold').text('Syrian Community in the Netherlands Platform', { align: 'center' });
doc.fontSize(18).font('Helvetica').text('(SY-NL)', { align: 'center' });
doc.moveDown();
doc.fontSize(16).font('Helvetica-Oblique').text('Comprehensive Technical Documentation', { align: 'center' });
doc.moveDown(3);
doc.fontSize(12).font('Helvetica').text(`Version 1.0`, { align: 'center' });
doc.text(`June 2026`, { align: 'center' });
doc.addPage();

// Parse and render markdown
let yPosition = doc.y;
const lineHeight = 14;
const pageHeight = doc.page.height;
const marginBottom = 50;

function addNewPageIfNeeded() {
  if (yPosition > pageHeight - marginBottom) {
    doc.addPage();
    yPosition = doc.y;
  }
}

const lines = markdownContent.split('\n');
let currentSection = '';

lines.forEach((line) => {
  addNewPageIfNeeded();
  
  if (line.startsWith('# ')) {
    // Main heading
    doc.addPage();
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#1a5632').text(line.substring(2), { continued: false });
    yPosition = doc.y + 10;
  } else if (line.startsWith('## ')) {
    // Sub heading
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#000000').text(line.substring(3), { continued: false });
    yPosition = doc.y + 8;
  } else if (line.startsWith('### ')) {
    // Sub-sub heading
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#333333').text(line.substring(4), { continued: false });
    yPosition = doc.y + 6;
  } else if (line.startsWith('#### ')) {
    // Fourth level heading
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#555555').text(line.substring(5), { continued: false });
    yPosition = doc.y + 4;
  } else if (line.startsWith('- ')) {
    // Bullet point
    doc.fontSize(10).font('Helvetica').fillColor('#000000').text('• ' + line.substring(2), { continued: false });
    yPosition = doc.y + lineHeight;
  } else if (line.match(/^\d+\./)) {
    // Numbered list
    doc.fontSize(10).font('Helvetica').fillColor('#000000').text(line, { continued: false });
    yPosition = doc.y + lineHeight;
  } else if (line.startsWith('|')) {
    // Table row
    const cells = line.split('|').filter(cell => cell.trim() !== '');
    if (cells.length > 1) {
      const cellWidth = (doc.page.width - 100) / cells.length;
      let xPos = 50;
      cells.forEach((cell, index) => {
        doc.fontSize(9).font('Helvetica').fillColor('#000000').text(cell.trim(), xPos, yPosition, { width: cellWidth - 5 });
        xPos += cellWidth;
      });
      yPosition += lineHeight + 2;
    }
  } else if (line.startsWith('```')) {
    // Code block - skip for PDF
  } else if (line.trim() === '') {
    // Empty line
    yPosition += lineHeight / 2;
  } else if (line.startsWith('**') && line.endsWith('**')) {
    // Bold text
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000').text(line.substring(2, line.length - 2), { continued: false });
    yPosition = doc.y + lineHeight;
  } else if (line.match(/\[.*\]\(.*\)/)) {
    // Link - extract text only
    const match = line.match(/\[(.*?)\]\(.*\)/);
    if (match) {
      doc.fontSize(10).font('Helvetica').fillColor('#0066cc').text(match[1], { continued: false });
      yPosition = doc.y + lineHeight;
    }
  } else {
    // Regular text
    doc.fontSize(10).font('Helvetica').fillColor('#000000').text(line, { continued: false });
    yPosition = doc.y + lineHeight;
  }
});

// Add page numbers
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  doc.fontSize(9).font('Helvetica').fillColor('#666666').text(
    `Page ${i + 1} of ${range.count}`,
    50,
    doc.page.height - 30,
    { align: 'center' }
  );
}

doc.end();

stream.on('finish', () => {
  console.log('PDF generated successfully: PROJECT_DOCUMENTATION.pdf');
});
