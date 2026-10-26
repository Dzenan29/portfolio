// Renders public/og.png (1200x630) from an SVG template. Run: node scripts/og-image.mjs
import sharp from "sharp";

const nodes = [
  ["SENSOR", 700], ["ESP32", 812], ["HTTP/MQTT", 924], ["LINUX", 1036],
];
const grid = Array.from({ length: 26 }, (_, i) => `<line x1="${i * 48}" y1="0" x2="${i * 48}" y2="630" />`).join("") +
  Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${i * 48}" x2="1200" y2="${i * 48}" />`).join("");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#080b10"/>
  <g stroke="#93a3b5" stroke-opacity="0.07">${grid}</g>
  <circle cx="1000" cy="80" r="360" fill="#3fd8f2" fill-opacity="0.05"/>
  <text x="72" y="112" font-family="Consolas, monospace" font-size="20" letter-spacing="4" fill="#64758a">DZENAN KUSI / ENGINEERING PORTFOLIO</text>
  <text x="72" y="236" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="76" letter-spacing="-2" fill="#e8edf2">FROM PHYSICAL SENSORS</text>
  <text x="72" y="322" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="76" letter-spacing="-2" fill="#93a3b5">TO INTELLIGENT SYSTEMS<tspan fill="#3fd8f2">.</tspan></text>
  <text x="72" y="400" font-family="Segoe UI, Arial, sans-serif" font-size="26" fill="#93a3b5">Embedded Systems · Industrial IoT · Infrastructure · Research IT</text>
  <path d="M72 500 H1128" stroke="#2b3a4a"/>
  <path d="M72 500 H600" stroke="#3fd8f2" stroke-dasharray="6 8" stroke-width="2"/>
  ${nodes.map(([l, x]) => `<g><rect x="${x - 48}" y="482" width="100" height="36" rx="6" fill="#111821" stroke="#2b3a4a"/><text x="${x + 2}" y="506" text-anchor="middle" font-family="Consolas, monospace" font-size="13" fill="#e8edf2">${l}</text></g>`).join("")}
  <circle cx="72" cy="500" r="6" fill="#3fd8f2"/>
  <text x="72" y="574" font-family="Consolas, monospace" font-size="18" fill="#64758a">Dortmund, Germany</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/og.png");
console.log("public/og.png written");
