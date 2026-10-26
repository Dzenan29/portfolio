import { defineConfig, devices } from "@playwright/test";

// Tests run against the static export in ./out (build first: `npm run build`).
// Locally they use the installed Microsoft Edge; in CI set PW_CHANNEL=chromium after `npx playwright install chromium`.
const channel = process.env.PW_CHANNEL ?? "msedge";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: "http://localhost:4173", trace: "retain-on-failure" },
  webServer: { command: "node scripts/serve.mjs 4173 out", port: 4173, reuseExistingServer: !process.env.CI },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], ...(channel === "chromium" ? {} : { channel }) } },
    { name: "mobile", use: { ...devices["Pixel 7"], ...(channel === "chromium" ? {} : { channel }) } },
  ],
});
