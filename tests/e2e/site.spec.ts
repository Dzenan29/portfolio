import { expect, test } from "@playwright/test";

const isMobile = (name: string) => name === "mobile";

test.describe("internationalization", () => {
  test("root redirects to the preferred language", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "de-DE" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/de\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await ctx.close();
  });

  test("language switch keeps the current page and is remembered", async ({ page }) => {
    await page.goto("/en/projects/lab-gas-monitoring/");
    await expect(page.locator("h1")).toHaveText("Laboratory Gas Monitoring & Alerting");
    await page.getByTestId("lang-de").click();
    await expect(page).toHaveURL(/\/de\/projects\/lab-gas-monitoring\/$/);
    await expect(page.locator("h1")).toHaveText("Monitoring & Alarmierung der Laborgase");
    await page.goto("/");
    await expect(page).toHaveURL(/\/de\/$/);
  });

  test("pages declare hreflang alternates and canonical", async ({ page }) => {
    await page.goto("/en/expertise/");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en\/expertise\/$/);
    await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveAttribute("href", /\/de\/expertise\/$/);
    await expect(page).toHaveTitle(/Expertise \| Dzenan Kusi/);
  });
});

test.describe("navigation", () => {
  test("main navigation reaches every page", async ({ page }, info) => {
    await page.goto("/en/");
    for (const [label, path] of [
      ["Projects", "/en/projects/"],
      ["Expertise", "/en/expertise/"],
      ["About", "/en/about/"],
      ["Experience", "/en/experience/"],
      ["Lab", "/en/lab/"],
    ] as const) {
      if (isMobile(info.project.name)) await page.getByTestId("menu-toggle").click();
      const scope = isMobile(info.project.name) ? page.locator("#mobile-menu") : page.locator("header nav").first();
      await scope.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("mobile menu opens, traps nothing and closes with Escape", async ({ page }, info) => {
    test.skip(!isMobile(info.project.name), "mobile only");
    await page.goto("/en/");
    const toggle = page.getByTestId("menu-toggle");
    await toggle.click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test("unknown URLs show the 404 page", async ({ page }) => {
    const res = await page.goto("/en/does-not-exist/");
    expect(res?.status()).toBe(404);
    await expect(page.getByText("Signal lost")).toBeVisible();
  });

  test("skip link moves focus to main content", async ({ page }, info) => {
    test.skip(isMobile(info.project.name), "keyboard test on desktop");
    await page.goto("/en/about/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe("projects", () => {
  test("filters by domain and shows truthful status labels", async ({ page }) => {
    await page.goto("/en/projects/");
    const cards = page.getByTestId("project-card");
    const total = await cards.count();
    expect(total).toBeGreaterThan(10);
    await page.getByTestId("filter-embedded").click();
    await expect(page.getByTestId("filter-embedded")).toHaveAttribute("aria-pressed", "true");
    const filtered = await cards.count();
    expect(filtered).toBeLessThan(total);
    for (const cat of await cards.evaluateAll((els) => els.map((e) => e.getAttribute("data-category")))) {
      expect(cat).toBe("embedded");
    }
    // In-development work is labeled as such.
    await expect(page.locator('#sec-in-development')).toBeVisible();
    await expect(page.locator('[data-status="in-development"]').first()).toHaveText(/In development/);
  });

  test("case study has status, architecture and depth toggle", async ({ page }) => {
    await page.goto("/en/projects/monitoring-automation/");
    await expect(page.locator('[data-status="completed"]').first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "System architecture" })).toBeVisible();
    const approach = page.getByRole("heading", { name: "The approach" });
    await expect(approach).toBeVisible();
    await page.getByTestId("depth-summary").click();
    await expect(approach).toBeHidden();
    await page.getByTestId("depth-technical").click();
    await expect(approach).toBeVisible();
  });
});

test.describe("engineering lab", () => {
  test("gauge converts angle to value", async ({ page }) => {
    await page.goto("/en/lab/");
    const angle = page.getByTestId("gauge-angle");
    await angle.fill("0");
    await expect(page.getByTestId("gauge-value")).toContainText("125.0");
    await page.getByTestId("gauge-valueMax").fill("10");
    await expect(page.getByTestId("gauge-value")).toContainText("5.00");
    await angle.fill("170");
    await expect(page.getByText(/outside calibrated range/)).toBeVisible();
  });

  test("sensor dashboard raises and clears alerts", async ({ page }) => {
    await page.goto("/en/lab/");
    const channel = page.getByTestId("channel-pressure");
    await expect(channel).toHaveAttribute("data-level", "normal");
    await page.getByTestId("iot-value").fill("11");
    await expect(channel).toHaveAttribute("data-level", "critical");
    await expect(page.getByTestId("iot-log")).toContainText("raised");
    await page.getByTestId("iot-value").fill("2");
    await expect(channel).toHaveAttribute("data-level", "normal");
    await expect(page.getByTestId("iot-log")).toContainText("back to normal");
  });

  test("infrastructure explorer works with the keyboard", async ({ page }, info) => {
    test.skip(isMobile(info.project.name), "diagram is a list on phones");
    await page.goto("/en/lab/");
    await page.getByTestId("infra-nas").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("infra-info")).toContainText("backup-nas");
    await expect(page.getByTestId("infra-nas")).toHaveAttribute("aria-pressed", "true");
  });

  test("availability flow alerts only after the threshold", async ({ page }) => {
    await page.goto("/en/lab/");
    const fail = page.getByTestId("flow-fail");
    await fail.click();
    await fail.click();
    await expect(page.getByTestId("flow-log")).not.toContainText("ALERT");
    await fail.click();
    await expect(page.getByTestId("flow-log")).toContainText("ALERT sent after 3 failures");
    await page.getByTestId("flow-ok").click();
    await expect(page.getByTestId("flow-log")).toContainText("RECOVERY");
  });
});

test.describe("theme & motion", () => {
  test("theme toggle switches and persists", async ({ page }) => {
    await page.goto("/en/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "dark");
    await page.getByTestId("theme-toggle").click();
    await expect(html).toHaveAttribute("data-theme", "light");
    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "light");
  });

  test("with reduced motion, no SVG particles are rendered and content is visible", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto("/en/");
    await expect(page.locator("animateMotion")).toHaveCount(0);
    await page.locator("#cta-title").scrollIntoViewIfNeeded();
    await expect(page.locator("#cta-title")).toBeVisible();
    await ctx.close();
  });
});

test.describe("contact", () => {
  test("shows only configured channels and no fake form", async ({ page }) => {
    await page.goto("/en/contact/");
    await expect(page.getByRole("link", { name: /dzenankusi00@gmail\.com/ }).first()).toBeVisible();
    await expect(page.locator("form")).toHaveCount(0);
  });
});
