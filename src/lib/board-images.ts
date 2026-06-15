export function normalizeBoardImagePath(image?: string | null): string {
  if (!image) return '';

  if (/^(https?:)?\/\//i.test(image) || image.startsWith('/')) {
    return image;
  }

  return `/images/board/${image}`;
}
