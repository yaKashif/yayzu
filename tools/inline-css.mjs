// Copies assets/site.css into the <style id="site-css"> block of every page, so pages can paint
// without waiting for a separate stylesheet. Edit assets/site.css, then run from the repo root:
//   node tools/inline-css.mjs
import fs from "node:fs";
import path from "node:path";

const css = fs
  .readFileSync("assets/site.css", "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "") // comments
  .replace(/\s+/g, " ")
  .replace(/\s*([{};])\s*/g, "$1")
  .trim();

// Site pages: the root pages and each game page. The games themselves (games/) are left alone.
const pages = [
  ...fs.readdirSync(".").filter((f) => f.endsWith(".html")),
  ...fs
    .readdirSync(".", { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith(".") && !["games", "assets", "tools", "node_modules"].includes(d.name))
    .map((d) => path.join(d.name, "index.html"))
    .filter((f) => fs.existsSync(f)),
];

const block = /<style id="site-css">[\s\S]*?<\/style>/;
for (const page of pages) {
  const html = fs.readFileSync(page, "utf8");
  if (!block.test(html)) {
    console.error(`${page}: no <style id="site-css"> block`);
    process.exitCode = 1;
    continue;
  }
  fs.writeFileSync(page, html.replace(block, () => `<style id="site-css">${css}</style>`));
  console.log(`${page}: inlined ${css.length} bytes`);
}
