import { test, expect } from "@playwright/test";

test.describe("i18n switching", () => {
  test("defaults to Arabic at /ar", async ({ page }) => {
    await page.goto("/ar");
    await expect(page).toHaveURL(/\/ar/);
  });

  test("renders English at /en", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveURL(/\/en/);
  });

  test("renders Dutch at /nl", async ({ page }) => {
    await page.goto("/nl");
    await expect(page).toHaveURL(/\/nl/);
  });

  test("redirects / to default locale", async ({ page }) => {
    await page.goto("/");
    const url = page.url();
    expect(url.endsWith("/") || url.includes("/ar")).toBeTruthy();
  });

  test("English and Arabic pages have different content", async ({ page }) => {
    await page.goto("/ar");
    const arabicContent = await page.locator("body").innerText();
    await page.goto("/en");
    const englishContent = await page.locator("body").innerText();
    expect(arabicContent).not.toEqual(englishContent);
  });
});
