import { expect, test, type Page } from "@playwright/test";

async function dismissToasts(page: Page) {
  const buttons = page.getByRole("button", { name: "Dismiss", exact: true });
  while (await buttons.count()) await buttons.first().click();
}

async function switchRole(page: Page, name: string) {
  await page.getByRole("button", { name: "Switch demo role" }).click();
  await page.getByRole("option", { name, exact: true }).click();
  await dismissToasts(page);
}

for (const width of [360, 390, 768, 1440]) {
  test(`customer pages fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of ["/", "/explore", "/events/crescendo-colombo", "/movies/serendib-skies", "/booking/session-crescendo/seats", "/account/tickets", "/checkout"]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.locator(".marketplace")).toBeVisible();
      if (route === "/") {
        await expect.poll(() => page.locator(".discovery-hero img").evaluate((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
      }
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const focused = route.startsWith("/events/") || route.startsWith("/movies/") || route.startsWith("/booking/") || route === "/checkout";
      if (focused || width >= 1024) await expect(page.getByRole("navigation", { name: "Customer navigation" })).not.toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}

test("mobile discovery filters, favorites, and keyboard-accessible filter sheet", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/explore", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("button", { name: "Switch demo role" })).toBeEnabled();
  await page.getByRole("navigation", { name: "Event categories" }).getByRole("button", { name: "Movies" }).click();
  await expect(page.locator(".event-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Save Serendib Skies", exact: true }).click();
  await expect(page.getByRole("button", { name: "Unsave Serendib Skies", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Open filters" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Ticket price").selectOption("Over Rs. 10,000");
  await dialog.getByRole("button", { name: "Show 0 experiences" }).click();
  await expect(page.getByRole("heading", { name: "A different plan, perhaps?" })).toBeVisible();
  await page.getByRole("button", { name: "Reset search" }).click();
  await expect(page.locator(".event-card")).toHaveCount(7);
  await page.getByRole("button", { name: "Open filters" }).click();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Open filters" })).toBeFocused();
});

test("mobile customer purchase issues tickets that check-in staff can validate once", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/events/crescendo-colombo", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("button", { name: "Switch demo role" })).toBeEnabled();
  await page.locator(".market-sticky-action").getByRole("button", { name: "Choose seats" }).click();
  await page.getByRole("button", { name: "Find best seats" }).click();
  await page.getByRole("button", { name: "Recommend adjacent seats" }).click();
  await expect(page.getByText(/Held for/)).toBeVisible();
  await dismissToasts(page);
  await page.locator(".market-sticky-action").getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "Review and pay" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("textbox", { name: "Promo code" }).fill("ENCORE10");
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(page.getByText("ENCORE10 applied", { exact: true })).toBeVisible();
  await page.getByRole("checkbox", { name: "I accept the event refund, transfer and venue entry policies." }).check();
  await page.getByRole("button", { name: /^Pay Rs/ }).click();
  await expect(page.getByRole("heading", { name: /You’re going to/ })).toBeVisible();
  await expect(page.getByLabel("Sample QR representation")).toHaveCount(2);
  const ticketNumber = await page.evaluate(() => JSON.parse(localStorage.getItem("encore-demo-v1")!).state.tickets[0].number as string);
  await dismissToasts(page);
  await switchRole(page, "Check-in staff");
  await page.getByPlaceholder("e.g. EVT-DEMO-001").fill(ticketNumber);
  await page.getByRole("button", { name: "Validate", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Entry approved" })).toBeVisible();
  await page.getByRole("button", { name: "Validate", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Already scanned" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("management workspaces remain light and desktop-oriented", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  for (const role of ["Event organizer", "Venue manager", "Box-office staff", "Check-in staff", "Platform admin"]) {
    await switchRole(page, role);
    await expect(page.locator(".portal-shell")).toBeVisible();
    await expect(page.locator(".marketplace")).toHaveCount(0);
    await expect(page.locator(".portal-shell > aside")).toBeInViewport();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator(".portal-shell").evaluate((element) => getComputedStyle(element).getPropertyValue("--surface").trim())).toBe("#f6f7fb");
  }
});

test("desktop category navigation updates an already open explore page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/explore", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".event-card")).toHaveCount(7);
  await page.locator(".market-header").getByRole("link", { name: "Movies", exact: true }).click();
  await expect(page.locator(".event-card")).toHaveCount(1);
  await expect(page.locator(".event-card")).toContainText("Serendib Skies");
});
