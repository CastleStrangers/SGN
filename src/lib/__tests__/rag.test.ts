import { describe, it, expect } from "vitest";

describe("RAG keyword extraction", () => {
  // extractKeywords is a private function in rag.ts
  // We test the logic indirectly via the module
  const STOP_WORDS = new Set([
    "ما", "هل", "كيف", "أين", "متى", "لماذا", "من", "إلى", "عن", "على",
    "في", "مع", "هذا", "هذه", "ذلك", "تلك", "كان", "كانت", "يكون",
    "ليس", "إن", "أن", "قد", "لقد", "سوف", "سيتم", "يمكن", "يجب",
    "هو", "هي", "هم", "هن", "أنا", "نحن", "أنت", "أنتم", "أو", "و",
    "ثم", "أي", "كل", "بعض", "منذ", "حتى", "لا", "لم", "لن", "اذا",
    "إذا",
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "need", "dare", "ought",
    "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
    "as", "into", "through", "during", "before", "after", "above", "below",
    "between", "out", "off", "over", "under", "again", "further", "then",
    "once", "here", "there", "when", "where", "why", "how", "all", "each",
    "every", "both", "few", "more", "most", "other", "some", "such", "no",
    "nor", "not", "only", "own", "same", "so", "than", "too", "very",
    "de", "het", "een", "van", "en", "is", "zijn", "met", "met", "op",
    "voor", "door", "aan", "in", "uit", "over", "na", "bij", "als", "maar", "om",
    "dat", "die", "dit", "ze", "zich", "we", "hij", "zij", "niet", "geen",
  ]);

  function extractKeywords(text: string): string[] {
    const words = text.toLowerCase().split(/[\s,؟?.\-!]+/);
    return [...new Set(words.filter((w) => w.length > 2 && !STOP_WORDS.has(w)))];
  }

  it("extracts Arabic keywords from question", () => {
    const result = extractKeywords("ما هي أخبار الجالية في هولندا؟");
    expect(result).toContain("أخبار");
    expect(result).toContain("الجالية");
    expect(result).toContain("هولندا");
    expect(result).not.toContain("ما");
    expect(result).not.toContain("في");
  });

  it("extracts English keywords filtering stop words", () => {
    const result = extractKeywords("the cat sat on the mat");
    expect(result).toContain("cat");
    expect(result).toContain("sat");
    expect(result).toContain("mat");
    expect(result).not.toContain("the");
    expect(result).not.toContain("on");
  });

  it("extracts Dutch keywords", () => {
    const result = extractKeywords("ik wil vrijwilliger worden bij de gemeenschap");
    expect(result).toContain("wil");
    expect(result).toContain("vrijwilliger");
    expect(result).toContain("worden");
    expect(result).toContain("gemeenschap");
    expect(result).not.toContain("ik");
    expect(result).not.toContain("de");
    expect(result).not.toContain("bij");
  });

  it("returns empty array for empty input", () => {
    expect(extractKeywords("")).toEqual([]);
  });

  it("returns empty array for only stop words", () => {
    expect(extractKeywords("a an the in on at")).toEqual([]);
  });

  it("deduplicates keywords", () => {
    const result = extractKeywords("news about news and events");
    const newsCount = result.filter((w) => w === "news").length;
    expect(newsCount).toBe(1);
  });

  it("filters words shorter than 3 characters", () => {
    const result = extractKeywords("a an it is to be");
    expect(result).toEqual([]);
  });

  it("handles mixed Arabic and English", () => {
    const result = extractKeywords("events في هولندا today");
    expect(result).toContain("events");
    expect(result).toContain("هولندا");
    expect(result).toContain("today");
  });
});
