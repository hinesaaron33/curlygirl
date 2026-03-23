import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads with hero section visible", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=GET STARTED").first()).toBeVisible();
  });

  test("navbar links are visible", async ({ page }) => {
    await expect(page.locator("nav >> text=About")).toBeVisible();
    await expect(page.locator("nav >> text=Features")).toBeVisible();
    await expect(page.locator("nav >> text=Pricing")).toBeVisible();
    await expect(page.locator("nav >> text=What's Included")).toBeVisible();
  });

  test("renders 4 core feature cards", async ({ page }) => {
    const cards = page.locator("text=Fresh Resources Every Month");
    await expect(cards).toBeVisible();
    await expect(page.locator("text=Scope & Sequence Included")).toBeVisible();
    await expect(page.locator("text=Filter & Find in Seconds")).toBeVisible();
    await expect(page.locator("text=Your Year, Your Way")).toBeVisible();
  });

  test("renders two pathway cards", async ({ page }) => {
    await expect(page.locator("text=Thematic & Seasonal Units")).toBeVisible();
    await expect(page.locator("text=Foundational ESL Units")).toBeVisible();
  });

  test("pricing toggle switches between monthly and yearly", async ({ page }) => {
    const pricingSection = page.locator("#pricing");
    await pricingSection.scrollIntoViewIfNeeded();

    // Default is yearly
    await expect(pricingSection.locator("text=$9.99").first()).toBeVisible();

    // Switch to monthly
    await page.getByRole("button", { name: "Monthly", exact: true }).click();
    await expect(pricingSection.locator("text=$14.99").first()).toBeVisible();
  });

  test("three pricing tier cards render", async ({ page }) => {
    const pricingSection = page.locator("#pricing");
    await pricingSection.scrollIntoViewIfNeeded();

    await expect(pricingSection.locator("text=Starter")).toBeVisible();
    await expect(pricingSection.locator("text=Essential")).toBeVisible();
    await expect(pricingSection.locator("text=Professional Plus")).toBeVisible();
  });

  test("compare plans table renders", async ({ page }) => {
    const compareSection = page.locator("#compare-plans");
    await compareSection.scrollIntoViewIfNeeded();

    await expect(compareSection.locator("text=Compare plans")).toBeVisible();
    await expect(compareSection.locator("text=Plan flexibility")).toBeVisible();
    await expect(compareSection.locator("text=Full library access")).toBeVisible();
  });

  test("what's included section renders with tier tabs", async ({ page }) => {
    const section = page.locator("#whats-included");
    await section.scrollIntoViewIfNeeded();

    await expect(section.locator("text=Your year,")).toBeVisible();
    await expect(section.locator("button", { hasText: "Starter" })).toBeVisible();
    await expect(section.locator("button", { hasText: "Essential" })).toBeVisible();
    await expect(section.locator("button", { hasText: "Professional Plus" })).toBeVisible();
  });

  test("what's included tier tabs switch content", async ({ page }) => {
    const section = page.locator("#whats-included");
    await section.scrollIntoViewIfNeeded();

    // Default is Starter — should show 2 lessons per month
    await expect(section.locator("text=2").first()).toBeVisible();

    // Switch to Essential — should show 4
    await section.locator("button", { hasText: "Essential" }).click();
    await expect(section.locator("text=4").first()).toBeVisible();

    // Switch to Pro+ — should show 6
    await section.locator("button", { hasText: "Professional Plus" }).click();
    await expect(section.locator("text=6").first()).toBeVisible();
  });

  test("sticky CTA bar appears after scrolling", async ({ page }) => {
    // Should be hidden at top
    const stickyBar = page.locator("text=See Plans").last();
    await expect(stickyBar).not.toBeInViewport();

    // Scroll down past hero
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(500);

    // Sticky bar buttons should be visible (use last() since there are other matching links above)
    await expect(page.getByRole("link", { name: "See Plans", exact: true }).last()).toBeVisible();
    await expect(page.getByRole("link", { name: "Compare Plans", exact: true }).last()).toBeVisible();
  });

  test("quiz CTA section renders", async ({ page }) => {
    await expect(page.locator("text=Not Sure Which Plan Is Right for You?")).toBeVisible();
    await expect(page.locator("text=Find Your Best Fit")).toBeVisible();
  });

  test("credits section renders", async ({ page }) => {
    await expect(page.locator("text=Credits That Add Up")).toBeVisible();
    await expect(page.locator("text=Store Credit").first()).toBeVisible();
  });

  test("testimonials section renders", async ({ page }) => {
    await expect(page.locator("text=Loved by educators everywhere")).toBeVisible();
  });
});
