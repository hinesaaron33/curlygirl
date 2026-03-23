import { test, expect } from "@playwright/test";

test.describe("Pricing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pricing");
  });

  test("renders three pricing tier cards", async ({ page }) => {
    await expect(page.locator("h3", { hasText: "Starter" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "Essential" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "Professional Plus" })).toBeVisible();
  });

  test("yearly toggle is active by default with save badge", async ({ page }) => {
    await expect(page.locator("text=SAVE 33%")).toBeVisible();
    await expect(page.locator("text=$9.99").first()).toBeVisible();
  });

  test("monthly toggle shows monthly prices", async ({ page }) => {
    await page.getByRole("button", { name: "Monthly", exact: true }).click();
    await expect(page.locator("text=$14.99").first()).toBeVisible();
    await expect(page.locator("text=$19.99").first()).toBeVisible();
    await expect(page.locator("text=$29.99").first()).toBeVisible();
  });

  test("yearly toggle shows yearly prices", async ({ page }) => {
    await page.getByRole("button", { name: /Yearly/ }).click();
    await expect(page.locator("text=$9.99").first()).toBeVisible();
    await expect(page.locator("text=$14.99").first()).toBeVisible();
    await expect(page.locator("text=$24.99").first()).toBeVisible();
  });

  test("best value badge on Professional Plus", async ({ page }) => {
    await expect(page.locator("text=Best Value")).toBeVisible();
  });

  test("comparison table renders with all feature rows", async ({ page }) => {
    await expect(page.locator("text=Compare plans").first()).toBeVisible();
    await expect(page.locator("text=Lessons delivered / month").first()).toBeVisible();
    await expect(page.locator("text=Plan flexibility").first()).toBeVisible();
    await expect(page.locator("text=Quarterly store credit").first()).toBeVisible();
    await expect(page.locator("text=Priority support").first()).toBeVisible();
  });

  test("comparison table shows correct lesson counts", async ({ page }) => {
    const lessonRow = page.locator("text=Lessons delivered / month").first().locator("..");
    await expect(lessonRow.locator("text=2")).toBeVisible();
    await expect(lessonRow.locator("text=4")).toBeVisible();
    await expect(lessonRow.locator("text=6")).toBeVisible();
  });

  test("CTA section renders", async ({ page }) => {
    await expect(page.locator("text=Ready to save hours on lesson planning?")).toBeVisible();
  });
});
