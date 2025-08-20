import { expect, test } from "@playwright/test";

// This test covers: login -> redirect to /dashboard -> logout -> back to landing
test("login → dashboard → logout", async ({ page }) => {
  await page.goto("/auth");

  // Fill email & password in Supabase Auth UI (robust selectors)
  await page.locator('input[type="email"]').first().fill("alice@example.com");
  await page.locator('input[type="password"]').first().fill("password123");
  await page.getByRole("button", { name: /sign in/i }).click();

  // Expect dashboard visible
  await expect(page.getByText("Welcome to your dashboard.")).toBeVisible({
    timeout: 30000,
  });

  // Ensure user email is shown in header
  await expect(page.getByLabel("user-email")).toHaveText(/alice@example.com/i);

  // Click Sign out button and confirm back on landing
  await page.getByRole("button", { name: /sign out/i }).click();
  await page.waitForURL("**/");

  // Ensure no auth cookies persist before visiting a protected route
  await page.context().clearCookies();

  // If we try to visit /dashboard now, middleware should redirect to auth
  await page.goto("/dashboard");
  await page.waitForURL("**/auth**");
});
