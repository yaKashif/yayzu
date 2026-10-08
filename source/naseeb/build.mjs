// Builds a self-contained copy of the game for publishing: the game and three.js bundled and
// minified into one game.js, and index.html pointed at it instead of node_modules.
// Usage: node build.mjs [outDir]   (default: dist)
import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { assertNoEnvLeak } from "../../tools/check-bundle.mjs";

const outDir = path.resolve(process.argv[2] || "dist");
await mkdir(outDir, { recursive: true });

await build({
  entryPoints: ["src/main.js"],
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2020",
  outfile: path.join(outDir, "game.js"),
});

// Never ship the build machine's environment (see tools/check-bundle.mjs).
await assertNoEnvLeak(path.join(outDir, "game.js"));

const replace = (html, from, to) => {
  if (!html.match(from)) throw new Error(`build: expected to find ${from} in index.html`);
  return html.replace(from, to);
};
let html = await readFile("index.html", "utf8");
html = replace(html, /\s*<script type="importmap">[\s\S]*?<\/script>/, "");
html = replace(html, '<script type="module" src="/src/main.js"></script>', '<script type="module" src="./game.js"></script>');
html = replace(html, '<p id="controls">', '<a class="more-games" href="../../" target="_top">More games on Yayzu</a>\n        <p id="controls">');
await writeFile(path.join(outDir, "index.html"), html);

console.log(`Built to ${outDir}`);
