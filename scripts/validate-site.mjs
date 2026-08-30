import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const canonicalOrigin = "https://www.huijiapetgear.com";
const htmlFiles = [
  "index.html",
  "custom-dog-harness-manufacturer.html",
  "wholesale-dog-harnesses-in-stock.html",
  "custom-printed-h-style-escape-resistant-dog-harness.html",
  "custom-dog-leash.html",
  "custom-dog-collar.html",
  "dog-walking-sets.html",
  "wholesale-dog-leashes.html",
  "private-label-dog-gear.html",
  "404.html",
  "privacy.html",
  "terms.html"
];
const errors = [];

const read = (path) => readFile(resolve(root, path), "utf8");

for (const file of ["index.html", "robots.txt", "sitemap.xml", "vercel.json"]) {
  try {
    await stat(resolve(root, file));
  } catch {
    errors.push(`Missing required file: ${file}`);
  }
}

for (const file of ["package.json", "vercel.json"]) {
  try {
    JSON.parse(await read(file));
  } catch (error) {
    errors.push(`${file} is not valid JSON: ${error.message}`);
  }
}

for (const file of htmlFiles) {
  const html = await read(file);
  const ids = new Set([...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]));
  const references = [...html.matchAll(/\s(?:href|src)=["']([^"']+)["']/g)].map((match) => match[1]);

  for (const reference of references) {
    if (/^(?:https?:|mailto:|data:)/.test(reference)) continue;
    if (reference.startsWith("#")) {
      if (reference.length > 1 && !ids.has(reference.slice(1))) {
        errors.push(`${file}: missing anchor target ${reference}`);
      }
      continue;
    }

    const [pathAndQuery, fragment] = reference.split("#");
    const [path] = pathAndQuery.split("?");
    const localPath = path.startsWith("/") ? path.slice(1) : resolve(dirname(file), path).slice(root.length + 1);
    const target = localPath || "index.html";
    let targetFile = target;
    try {
      try {
        await stat(resolve(root, targetFile));
      } catch {
        if (!targetFile.includes(".")) {
          targetFile = `${targetFile}.html`;
          await stat(resolve(root, targetFile));
        } else {
          throw new Error("Missing target");
        }
      }
      if (fragment && targetFile.endsWith(".html")) {
        const targetHtml = await read(targetFile);
        if (!new RegExp(`\\sid=["']${fragment}["']`).test(targetHtml)) {
          errors.push(`${file}: missing anchor target ${reference}`);
        }
      }
    } catch {
      errors.push(`${file}: missing internal asset ${reference}`);
    }
  }

  for (const match of html.matchAll(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/g)) {
    try {
      const structuredData = JSON.parse(match[1]);
      const nodes = structuredData["@graph"] ?? [structuredData];
      for (const node of nodes) {
        const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
        if (
          types.includes("Product") &&
          !node.offers &&
          !node.review &&
          !node.aggregateRating
        ) {
          errors.push(`${file}: Product structured data requires a genuine offer, review, or aggregate rating`);
        }
      }
    } catch (error) {
      errors.push(`${file}: invalid JSON-LD: ${error.message}`);
    }
  }
}

const index = await read("index.html");
if (!index.includes(`<link href="${canonicalOrigin}/" rel="canonical"`)) {
  errors.push("index.html: canonical URL is missing or incorrect");
}
if (!index.includes(`content="${canonicalOrigin}/" property="og:url"`)) {
  errors.push("index.html: Open Graph URL is missing or incorrect");
}

const robots = await read("robots.txt");
if (!robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`)) {
  errors.push("robots.txt: canonical sitemap URL is missing or incorrect");
}

const sitemap = await read("sitemap.xml");
if (!sitemap.startsWith("<?xml") || !sitemap.includes("<urlset") || !sitemap.includes("</urlset>")) {
  errors.push("sitemap.xml: required XML document structure is missing");
}
for (const [, location] of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) {
  if (!location.startsWith(`${canonicalOrigin}/`)) {
    errors.push(`sitemap.xml: non-canonical URL ${location}`);
  }
}

const vercel = JSON.parse(await read("vercel.json"));
const apexRedirect = vercel.redirects?.find((redirect) =>
  redirect.has?.some((condition) => condition.type === "host" && condition.value === "huijiapetgear.com")
);
if (
  !apexRedirect?.permanent ||
  apexRedirect.source !== "/:path*" ||
  apexRedirect.destination !== `${canonicalOrigin}/:path*`
) {
  errors.push("vercel.json: permanent apex-to-www redirect is missing or incorrect");
}

const immutableAssetHeader = vercel.headers?.find((rule) =>
  rule.source.startsWith("/assets/") &&
  rule.headers?.some((header) => header.key.toLowerCase() === "cache-control" && /\bimmutable\b/i.test(header.value))
);
if (immutableAssetHeader) {
  errors.push("vercel.json: unhashed assets must not use immutable caching");
}

const walkingSets = await read("dog-walking-sets.html");
if (walkingSets.includes('"@type":"Product"')) {
  errors.push("dog-walking-sets.html: collection page must not use Product structured data without a genuine offer or review");
}
if (!walkingSets.includes('"@type":"CollectionPage"') || !walkingSets.includes('"@type":"Service"')) {
  errors.push("dog-walking-sets.html: CollectionPage and manufacturing Service structured data are required");
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${htmlFiles.length} HTML files, JavaScript, JSON, XML, internal links, and canonical deployment settings.`);
}
