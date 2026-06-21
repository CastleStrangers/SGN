export function normalizeBoardImagePath(image?: string | null): string {
  if (!image) return '';

  // اعتراض روابط الصور للرئيس والأمين العام وتحويلها للمسارات المحلية
  if (image.includes('chairman.png')) {
    return '/images/board/chairman.png';
  }
  if (image.includes('secretary.png')) {
    return '/images/board/secretary.png';
  }

  if (/^(https?:)?\/\//i.test(image) || image.startsWith('/')) {
    return image;
  }

  return `/images/board/${image}`;
}
