import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const check = process.argv.includes('--check');
const catalog = JSON.parse(await readFile(resolve(root, 'catalog/products.json'), 'utf8'));
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const plain = text => text.replace(/<[^>]*>/g, '').replace(/&#(x[\da-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n))).replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, n) => ({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '}[n])).replace(/\s+/g, ' ').trim();
const itemPattern = /<div class="ref-faq-item">\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>\s*<\/div>/g;
let changed = 0;
const pages = [...catalog.map(p => ({ file: `${p.slug}.html`, faqs: p.faqs })), { file: 'wholesale-reflective-printed-mesh-dog-harness-leash-set.html' }];
for (const { file, faqs } of pages) {
  const path = resolve(root, file);
  const original = await readFile(path, 'utf8');
  let html = original;
  if (faqs) {
    if (!faqs.length || faqs.some(q => !q.question || !q.answer)) throw new Error(`Missing FAQ content: ${file}`);
    const items = faqs.map(q => `<div class="ref-faq-item"><h3>${escape(q.question)}</h3><p>${escape(q.answer)}</p></div>`).join('');
    let first = true;
    html = html.replace(itemPattern, () => { if (!first) return ''; first = false; return items; });
    if (first) throw new Error(`FAQ panel missing: ${file}`);
  }
  const questions = [...html.matchAll(itemPattern)].map(m => ({ '@type': 'Question', name: plain(m[1]), acceptedAnswer: { '@type': 'Answer', text: plain(m[2]) } }));
  if (!questions.length) throw new Error(`No visible FAQ entries: ${file}`);
  let schemas = 0;
  html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (tag, json) => {
    const data = JSON.parse(json);
    let changedSchema = false;
    const visit = node => {
      if (Array.isArray(node)) return node.forEach(visit);
      if (!node || typeof node !== 'object') return;
      if (node['@type'] === 'FAQPage') { node.mainEntity = questions; changedSchema = true; schemas++; }
      Object.values(node).forEach(visit);
    };
    visit(data);
    return changedSchema ? `<script type="application/ld+json">${JSON.stringify(data)}</script>` : tag;
  });
  if (schemas !== 1) throw new Error(`Expected one FAQPage: ${file}`);
  if (html !== original) {
    changed++;
    if (check) throw new Error(`FAQ HTML/schema out of sync: ${file}. Run npm run sync:faqs.`);
    await writeFile(path, html);
  }
}
console.log(`FAQ content and schema ${check ? 'verified' : 'synchronized'} on ${pages.length} pages (${changed} changed).`);
