import { test, expect } from "@playwright/test";

test.describe("Demo app smoke", () => {
  test("loads and shows demo title", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Template library demo" })).toBeVisible();
  });

  test("hook: run updates status (UI only)", async ({ page }) => {
    await page.goto("/");
    const runBtn = page.getByRole("button", { name: "Run" });
    await expect(runBtn).toBeVisible();
    await runBtn.click();
    await expect(page.getByRole("status").first()).toContainText(/Success|Failed/, {
      timeout: 5000,
    });
  });

  test("component: click triggers and shows result", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Run via component" });
    await expect(trigger).toBeVisible();
    await trigger.click();
    const result = page.locator("[data-component-result]");
    await expect(result).toContainText(/ok|err/, { timeout: 5000 });
  });

  test("imperative: click triggers and shows result", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Run imperative" });
    await expect(trigger).toBeVisible();
    await trigger.click();
    const result = page.locator("[data-imperative-result]");
    await expect(result).toContainText(/Success|Failed/, { timeout: 5000 });
  });
});
