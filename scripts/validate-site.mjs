import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const canonicalOrigin = "https://www.huijiapetgear.com";
const htmlFiles = (await readdir(root)).filter((file) => file.endsWith(".html")).sort();
const errors = [];
const htmlByFile = new Map();

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
  htmlByFile.set(file, html);
  const ids = new Set([...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]));
  const references = [...html.matchAll(/\s(?:href|src)=["']([^"']+)["']/g)].map((match) => match[1]);

  const descriptionTag = html.match(/<meta\b[^>]*\bname=["']description["'][^>]*>/i)?.[0];
  const description = descriptionTag?.match(/\bcontent=(["'])(.*?)\1/i)?.[2];
  if (description && description.length > 160) {
    errors.push(`${file}: meta description is ${description.length} characters; keep it at 160 or fewer`);
  }

  const stylesheetPaths = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => /\brel=["']stylesheet["']/i.test(tag))
    .map((tag) => tag.match(/\bhref=["']([^"']+)["']/i)?.[1])
    .filter(Boolean)
    .map((href) => href.split("?")[0]);
  for (const stylesheet of new Set(stylesheetPaths)) {
    if (stylesheetPaths.filter((path) => path === stylesheet).length > 1) {
      errors.push(`${file}: duplicate stylesheet request for ${stylesheet}`);
    }
  }

  for (const [logoTag] of html.matchAll(/<img\b[^>]*\bsrc=["'][^"']*logo\.jpg["'][^>]*>/gi)) {
    if (!/\bwidth=["']\d+["']/i.test(logoTag) || !/\bheight=["']\d+["']/i.test(logoTag)) {
      errors.push(`${file}: logo image must include explicit width and height`);
    }
  }

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
      // Quote-only B2B product pages may use Product semantics without a public
      // price, review, or aggregate rating. Never add unsupported Offer or
      // review data merely to qualify for a Google rich result.
      void (structuredData["@graph"] ?? [structuredData]);
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
const sitemapLocations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
for (const location of sitemapLocations) {
  if (!location.startsWith(`${canonicalOrigin}/`)) {
    errors.push(`sitemap.xml: non-canonical URL ${location}`);
  }
}

for (const location of sitemapLocations) {
  const path = new URL(location).pathname.replace(/\/$/, "") || "/";
  if (path === "/") continue;
  const targetFile = `${path.slice(1)}.html`;
  const inboundSources = [...htmlByFile.entries()].filter(([file, html]) =>
    file !== targetFile && new RegExp(`href=["']${path}(?:[#?][^"']*)?["']`).test(html)
  );
  if (!inboundSources.length) {
    errors.push(`${targetFile}: sitemap URL has no internal link from another HTML page`);
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

for (const file of ["private-label-dog-gear.html", "wholesale-dog-leashes.html"]) {
  const html = htmlByFile.get(file) ?? "";
  if (!html.includes('"@type": "WebPage"') || !html.includes('"@type": "Service"')) {
    errors.push(`${file}: WebPage and Service structured data are required`);
  }
}

const hStyleHarness = htmlByFile.get("custom-printed-h-style-escape-resistant-dog-harness.html") ?? "";
if (!hStyleHarness.includes('"@type":"Product"') || !hStyleHarness.includes('"sku":"H-T01"')) {
  errors.push("custom-printed-h-style-escape-resistant-dog-harness.html: Product schema with SKU H-T01 is required");
}
if (hStyleHarness.includes('"serviceType":"Ready-stock printed H-style dog harness')) {
  errors.push("custom-printed-h-style-escape-resistant-dog-harness.html: physical product must not use Service properties");
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${htmlFiles.length} HTML files, JavaScript, JSON, XML, internal links, and canonical deployment settings.`);
}
