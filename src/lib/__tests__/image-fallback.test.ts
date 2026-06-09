import { describe, it, expect } from "vitest";
import { PLACEHOLDER_IMG, resolveImage } from "../image-fallback";

describe("PLACEHOLDER_IMG", () => {
  it("is a data URL", () => {
    expect(PLACEHOLDER_IMG).toMatch(/^data:image\/svg\+xml/);
  });

  it("contains SVG markup", () => {
    expect(PLACEHOLDER_IMG).toContain("svg");
    expect(PLACEHOLDER_IMG).toContain("1a5632");
  });
});

describe("resolveImage", () => {
  it("returns placeholder when img is null", () => {
    expect(resolveImage(null)).toBe(PLACEHOLDER_IMG);
  });

  it("returns placeholder when img is empty string", () => {
    expect(resolveImage("")).toBe(PLACEHOLDER_IMG);
  });

  it("returns placeholder when img is undefined", () => {
    expect(resolveImage(undefined)).toBe(PLACEHOLDER_IMG);
  });

  it("returns http URL as-is", () => {
    const url = "http://example.com/image.jpg";
    expect(resolveImage(url)).toBe(url);
  });

  it("returns https URL as-is", () => {
    const url = "https://cdn.example.com/img.png";
    expect(resolveImage(url)).toBe(url);
  });

  it("returns relative path as-is", () => {
    const path = "/uploads/photo.jpg";
    expect(resolveImage(path)).toBe(path);
  });

  it("returns placeholder for non-http relative path without leading slash", () => {
    expect(resolveImage("uploads/photo.jpg")).toBe(PLACEHOLDER_IMG);
  });
});
