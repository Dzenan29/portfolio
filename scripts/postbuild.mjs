// Post-processing of the static export for plain static hosts such as GitHub Pages.
//
// 1. Next.js writes per-segment prefetch payloads as nested folders
//    (`__next.$d$locale/projects/__PAGE__.txt`) but the client requests them with flat names
//    (`__next.$d$locale.projects.__PAGE__.txt`). Without rewrites those requests 404 and every
//    client-side navigation falls back to a slower path. We add flat copies next to the folders.
// 2. `.nojekyll` stops GitHub Pages from hiding the `_next` directory.
import { copyFileSync, existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const out = process.argv[2] ?? "out";
if (!existsSync(out)) throw new Error(`${out} not found - run next build first`);

let copied = 0;
function walkFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walkFiles(p) : [p];
  });
}
function visit(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      for (const file of walkFiles(p)) {
        const flat = join(dir, `${name}.${relative(p, file).split(sep).join(".")}`);
        if (!existsSync(flat)) {
          copyFileSync(file, flat);
          copied++;
        }
      }
    } else {
      visit(p);
    }
  }
}

visit(out);
writeFileSync(join(out, ".nojekyll"), "");
console.log(`postbuild: ${copied} segment payloads flattened, .nojekyll written`);
