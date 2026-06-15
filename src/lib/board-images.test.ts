import { describe, expect, it } from 'vitest';
import { normalizeBoardImagePath } from './board-images';

describe('normalizeBoardImagePath', () => {
  it('converts bare board filenames to public image URLs', () => {
    expect(normalizeBoardImagePath('chairman.png')).toBe('/images/board/chairman.png');
    expect(normalizeBoardImagePath('director.png')).toBe('/images/board/director.png');
  });

  it('keeps existing absolute and public paths unchanged', () => {
    expect(normalizeBoardImagePath('/images/board/chairman.png')).toBe('/images/board/chairman.png');
    expect(normalizeBoardImagePath('https://example.com/board.jpg')).toBe('https://example.com/board.jpg');
  });
});
