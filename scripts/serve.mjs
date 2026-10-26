// Minimal static server for the exported site (behaves like GitHub Pages for our purposes).
// Usage: node scripts/serve.mjs [port] [dir]
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const port = Number(process.argv[2] ?? 4173);
const root = process.argv[3] ?? "out";
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2", ".xml": "application/xml",
  ".txt": "text/plain", ".ico": "image/x-icon",
};

createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  let file = normalize(join(root, url));
  if (!file.startsWith(normalize(root))) return res.writeHead(403).end();
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!url.endsWith("/")) return res.writeHead(301, { Location: `${url}/` }).end();
    file = join(file, "index.html");
  }
  if (!existsSync(file)) {
    res.writeHead(404, { "Content-Type": types[".html"] });
    return createReadStream(join(root, "404.html")).pipe(res);
  }
  res.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`serving ${root} on http://localhost:${port}`));
