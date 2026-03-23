import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("logo links to homepage", async ({ page }) => {
    await page.goto("/");
    const logo = page.locator("a[href='/']", { hasText: "Curly Girl" });
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute("href", "/");
  });

  test("About link scrolls to about section", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav >> text=About").click();
    await page.waitForTimeout(500);

    const aboutSection = page.locator("#about");
    await expect(aboutSection).toBeInViewport();
  });

  test("Features link scrolls to features section", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav >> text=Features").click();
    await page.waitForTimeout(500);

    const featuresSection = page.locator("#features");
    await expect(featuresSection).toBeInViewport();
  });

  test("Pricing link scrolls to pricing section", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav >> text=Pricing").first().click();
    await page.waitForTimeout(500);

    const pricingSection = page.locator("#pricing");
    await expect(pricingSection).toBeInViewport();
  });

  test("mobile menu opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    // Menu button should be visible on mobile
    const menuButton = page.locator("button[aria-label='Toggle menu']");
    await expect(menuButton).toBeVisible();

    // Open menu
    await menuButton.click();
    await expect(page.locator("text=About").last()).toBeVisible();

    // Close menu
    await menuButton.click();
    await page.waitForTimeout(300);
  });

  test("pricing page loads independently", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.locator("text=Choose your plan")).toBeVisible();
    await expect(page.locator("h3", { hasText: "Starter" })).toBeVisible();
  });
});
