// Fails a game build whose bundle carries any of the build machine's environment, the classic
// leak where a bundler is handed all of process.env. Checked against the real environment the
// build runs in (npm's own npm_* variables included):
// - no variable's name used as an object key, quoted or not, since minifiers drop the quotes;
// - no variable's value (anything 6+ characters long that isn't just a number) anywhere in it,
//   as written or as escaped inside a JS string (C:\Users becomes C:\\Users);
// - no leftover process.env references.
// Values of npm_package_* are skipped: they describe the game's own package.json, which is public,
// and its name legitimately appears in the game (as in its saved-score key).
import { readFile } from "node:fs/promises";

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function assertNoEnvLeak(file) {
  const bundle = await readFile(file, "utf8");
  const leaks = [];
  for (const [name, value] of Object.entries(process.env)) {
    if (name.length > 2 && new RegExp(`(?<![\\w$])["'\`]?${escapeRegExp(name)}["'\`]?\\s*:`).test(bundle)) {
      leaks.push(`${name} used as a key`);
    }
    if (!value || value.length < 6 || /^[\d.]+$/.test(value) || name.startsWith("npm_package_")) continue;
    const escaped = JSON.stringify(value).slice(1, -1);
    if (bundle.includes(value) || bundle.includes(escaped)) leaks.push(`value of ${name}`);
  }
  const refs = (bundle.match(/process\.env/g) || []).length;
  if (refs) leaks.push(`${refs} process.env reference(s)`);
  if (leaks.length) throw new Error(`${file} leaks the build environment: ${leaks.join("; ")}`);
  console.log(`Checked ${file}: no environment variable names, values or process.env references`);
}
