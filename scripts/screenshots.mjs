// Full-page screenshots for visual review: node scripts/screenshots.mjs <baseUrl> <outDir> [paths...]
// Uses the locally installed Microsoft Edge (or Chrome via PW_CHANNEL=chrome), so no browser download is needed.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const [, , base = "http://localhost:3000", out = "screenshots", ...paths] = process.argv;
const targets = paths.length ? paths : ["/en/"];
const widths = (process.env.WIDTHS ?? "1440,390").split(",").map(Number);
const theme = process.env.THEME ?? "dark";

mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? "msedge" });
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  await page.addInitScript((t) => localStorage.setItem("dk-theme", t), theme);
  for (const path of targets) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    // Reveal everything that would fade in on scroll.
    await page.evaluate(() => document.querySelectorAll(".reveal").forEach((el) => (el.dataset.visible = "true")));
    const name = `${path.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "root"}-${width}-${theme}.png`;
    await page.screenshot({ path: `${out}/${name}`, fullPage: true });
    console.log(`${out}/${name}`);
  }
  await page.close();
}
await browser.close();
