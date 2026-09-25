import { readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash } from "node:crypto";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFile(resolve(root, path), "utf8");
const header = (await read("partials/site-header.html")).trim();
const footer = (await read("partials/site-footer.html")).trim();
const version = createHash("sha256").update(await read("assets/css/brand-shell.css")).digest("hex").slice(0, 12);
const stylesheet = `<link href="/assets/css/brand-shell.css?v=${version}" rel="stylesheet"/>`;
const checkOnly = process.argv.includes("--check");
const changed = [];
const files = (await readdir(root)).filter((file) => file.endsWith(".html")).sort();

for (const file of files) {
  const html = await read(file);
  const headers = html.match(/<header\b[^>]*\bclass=["'][^"']*\bsite-header\b[^"']*["'][^>]*>[\s\S]*?<\/header>/gi) ?? [];
  const footers = html.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi) ?? [];
  if (headers.length !== 1 || footers.length !== 1 || !html.includes("</head>")) {
    throw new Error(`${file}: expected one site header, one footer, and a head element`);
  }

  // Existing pages may omit the announcement bar. Keep all content outside the shell intact.
  const headerStart = html.indexOf(headers[0]);
  const topbarStart = html.slice(0, headerStart).search(/<div\b[^>]*\bclass=["']topbar["'][^>]*>/i);
  const start = topbarStart < 0 ? headerStart : topbarStart;
  let updated = html.slice(0, start) + header + html.slice(headerStart + headers[0].length);
  updated = updated.replace(footers[0], footer);

  // Pin the common stylesheet after page styles and content-version it to avoid stale chrome.
  updated = updated.replace(/<link\b[^>]*\bhref=["']\/?assets\/css\/brand-shell\.css(?:\?[^"']*)?["'][^>]*>\s*/gi, "");
  updated = updated.replace(/\s*<\/head>/i, `\n${stylesheet}\n</head>`);

  if (updated !== html) {
    changed.push(file);
    if (!checkOnly) await writeFile(resolve(root, file), updated);
  }
}

if (checkOnly && changed.length) {
  console.error(`Shared header/footer is out of sync in ${changed.length} pages. Run npm run sync:shell.\n${changed.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`${checkOnly ? "Checked" : "Synchronized"} shared header/footer across ${files.length} pages (${changed.length} updated).`);
}
