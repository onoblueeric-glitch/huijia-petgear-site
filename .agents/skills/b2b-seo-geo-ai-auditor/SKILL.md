---
name: b2b-seo-geo-ai-auditor
description: Evidence-based SEO, GEO, and AI recommendation audit for B2B manufacturer websites. Use when the user asks to score, audit, compare, optimize, or plan a website/page for Google SEO, generative-engine visibility, AI citations, AI recommendations, supplier discovery, or knowledge-base completeness. Produces separate 100-point scores, evidence, missing-data research, and prioritized implementation actions. Calibrated first for HUIJIA PET and reusable across B2B manufacturing industries.
---

# B2B SEO + GEO + AI Recommendation Auditor

Use this skill to produce consistent, repeatable audits rather than impressionistic scores.

Default report language: Chinese.
Default website copy and metadata suggestions: English unless the user requests another language.
Default calibration site: https://www.huijiapetgear.com/
Default business type: export-oriented B2B manufacturer, OEM/ODM, private label, wholesale.

Read all files in references before final scoring:

- references/scoring-rubric.md
- references/evidence-policy.md
- references/knowledge-base-schema.md
- references/query-playbook.md
- references/huijia-profile.md when auditing HUIJIA PET

Use scripts/gemini_grounded_search.py only when GEMINI_API_KEY is available and direct Gemini Grounding is requested or materially useful. Otherwise use the session's web search capability. Never expose API keys.

## Required outputs

Always provide:

1. SEO score out of 100.
2. GEO score out of 100.
3. AI Recommendation score out of 100.
4. Evidence confidence score out of 100.
5. A short conclusion explaining the main constraint on growth.
6. Scored findings with page-level evidence.
7. A knowledge-base gap table.
8. Current external research with source links and retrieval dates.
9. P0, P1, and P2 actions ranked by impact and effort.
10. Exact implementation recommendations for titles, copy, schema, internal links, or page creation when applicable.
11. A machine-readable JSON result when the user asks for automation, comparison, export, or repeated monitoring.

Never present the three scores as official Google metrics. They are an internal, evidence-based audit standard. Never guarantee rankings, traffic, citations, or AI recommendations.

## Core principles

- Score what is observable.
- Separate facts, sourced public facts, inferences, and unknowns.
- Every awarded or deducted point must map to evidence.
- Do not award the same improvement twice across overlapping criteria.
- Use fixed weights from the rubric; do not change weights to make a site look better.
- Distinguish page score from whole-site score.
- Distinguish implementation quality from real-world performance.
- Treat model answers as tests, not ground truth about market share.
- Prefer primary and authoritative sources for technical, legal, standards, certification, and company claims.
- Public search may fill industry and competitor knowledge. It must not invent private company facts.
- Keep recommendations compatible with the existing visual design unless the user explicitly asks for redesign.

## Inputs

Accept one or more of:

- A live URL, domain, sitemap, or list of pages.
- Local HTML or repository source.
- Search Console, analytics, crawling, keyword, or backlink exports.
- Product catalogs, certificates, audit reports, factory documents, FAQs, or company profiles.
- Competitor URLs.
- Target markets, buyer types, product groups, and priority queries.

If only a URL is supplied, run a public-data audit and lower confidence for unavailable internal or performance data. Do not block the audit unless the site cannot be accessed at all.

## Workflow

### 1. Establish scope

State:

- Audit unit: one page, page group, or whole site.
- Target market and language.
- Business model and primary conversion.
- Main commercial query or query cluster.
- Available evidence and unavailable evidence.

Infer obvious context from the site and existing project files. Ask only questions that materially change the score or recommended architecture.

### 2. Capture the site evidence

Inspect as available:

- HTTP status, redirects, robots directives, canonical, sitemap, hreflang, and indexability.
- Rendered title, meta description, headings, main content, links, images, forms, and calls to action.
- Structured data and whether visible content supports its claims.
- Navigation, breadcrumbs, category and product hierarchy, orphan pages, and duplicate intent.
- Mobile rendering, performance signals, accessibility basics, and intrusive UI.
- Manufacturer identity, address, contact details, factory proof, certificates, processes, capabilities, MOQ, lead time, capacity, quality control, materials, compliance, customization, logistics, and after-sales terms.
- Content consistency across homepage, category pages, product pages, About, Factory, Contact, and policy pages.

Record exact URLs and evidence snippets. Do not rely only on a homepage screenshot.

### 3. Build the fact ledger

Classify each material claim as:

- verified_internal: supplied by the user or an authenticated company document.
- verified_site: explicitly visible on the audited site.
- verified_public: supported by a primary or authoritative external source.
- corroborated_public: supported by at least two credible independent sources.
- inferred: reasonable interpretation that is not verified.
- missing: required field with no reliable value.
- conflicting: sources disagree.
- unsafe_claim: unverifiable, exaggerated, misleading, or legally sensitive.

Only verified facts may be written as definite company claims. Clearly label inferences.

### 4. Research current external context

Internet research is mandatory when scoring competitive visibility, current SERPs, standards, regulations, product trends, competitor evidence, or AI recommendation performance.

Search in focused batches:

- Commercial buyer queries.
- Manufacturer/supplier/private-label queries.
- Product and specification queries.
- Buyer-risk and due-diligence questions.
- Competitor comparison queries.
- Certification, test standard, and regulatory queries.
- Brand/entity queries.
- AI-style natural-language recommendation queries.

Prefer sources in this order:

1. Official standards, regulators, certification bodies, manufacturers, and company pages.
2. Search-engine documentation and recognized technical documentation.
3. Reputable industry associations, trade publications, and research.
4. Credible distributors, retailers, and competitors for observable product or positioning facts.
5. Forums and social sources only for buyer-language discovery, never as sole support for material factual claims.

Attach sources to the specific finding they support. Record retrieval date.

### 5. Fill the knowledge-base gaps

Use references/knowledge-base-schema.md.

For every missing field:

- Decide whether it is public-researchable, internally answerable, document-extractable, or unknowable.
- Search only public-researchable fields.
- Extract document facts only from supplied evidence.
- Convert internally answerable gaps into concise questions for the user.
- Leave unknowable fields blank.
- Never convert competitor data or an industry norm into a HUIJIA company fact.
- Rank gaps by expected effect on SEO, GEO, AI recommendation, and buyer conversion.

### 6. Run AI recommendation probes

Use 8 to 20 realistic prompts for a page audit and 20 to 50 for a whole-site audit.

Test at least these prompt types:

- Category discovery.
- Supplier shortlist.
- Private-label or OEM request.
- Specification-constrained request.
- Risk/compliance request.
- Comparison request.
- Region or delivery request.
- Brand/entity verification.

When possible, use more than one answer surface or model. Record:

- Whether the audited brand is mentioned.
- Whether it is recommended, merely listed, or omitted.
- Whether a source from the audited domain is cited.
- Which competitors appear.
- Which facts or evidence caused the apparent selection.
- Query, date, locale/language, model or surface, and citations.

Do not claim that a limited probe measures all Google AI Mode or AI Overview exposure. It is a repeatable sample.

### 7. Score independently

Apply references/scoring-rubric.md exactly.

Calculate:

- SEO score = sum of SEO criteria after caps and penalties.
- GEO score = sum of GEO criteria after caps and penalties.
- AI Recommendation score = sum of AI criteria after caps and penalties.
- Evidence confidence = completeness and reliability of the evidence used.

Show section subtotals. If evidence is unavailable, mark not observed and reduce confidence. Do not automatically award points.

### 8. Recommend changes

Classify actions:

- P0: blocks crawling, indexing, trust, factual accuracy, or conversion.
- P1: high-impact relevance, evidence, entity, page architecture, and citation improvements.
- P2: supporting content, refinements, and experimentation.

For each action include:

- Problem and evidence.
- Exact page or template.
- Proposed change.
- Expected score categories affected.
- Estimated recoverable audit points.
- Impact: high, medium, or low.
- Effort: small, medium, or large.
- Dependency or required company data.
- Verification method.

Recoverable points are audit estimates, not ranking forecasts.

### 9. Preserve UI quality

When the user asks to improve an existing site without disrupting design:

- Prefer concise proof blocks, specification tables, FAQs, metadata, schema, internal links, and dedicated supporting pages.
- Avoid keyword stuffing, repetitive sections, oversized text walls, and generic AI prose.
- Reuse the site's design tokens and component patterns.
- Keep primary commercial content visible without overwhelming the page.
- Place deeper evidence on About, Factory, Quality, Certifications, capabilities, and product-detail pages, then link contextually.

### 10. Re-audit

After implementation:

- Reinspect the changed URLs.
- Recalculate scores with the same weights.
- Show before/after criterion changes.
- Confirm structured data matches visible content.
- List unresolved knowledge gaps and blocked verification steps.
- Do not increase a score merely because a recommendation was implemented; verify the result.

## Standard human-readable report

Use this order:

1. Audit scope and date.
2. Scorecard.
3. Executive diagnosis.
4. Critical caps or penalties.
5. SEO findings.
6. GEO findings.
7. AI recommendation findings.
8. Knowledge-base gaps.
9. External research and competitor evidence.
10. P0/P1/P2 action plan.
11. Exact page changes.
12. Expected recoverable audit points.
13. Sources and limitations.

Keep the opening concise. Use tables where exact mappings improve readability.

## Machine-readable result

When requested, return valid JSON matching this top-level structure:

{
  "audit": {},
  "scores": {
    "seo": 0,
    "geo": 0,
    "ai_recommendation": 0,
    "evidence_confidence": 0
  },
  "section_scores": [],
  "caps_and_penalties": [],
  "findings": [],
  "knowledge_gaps": [],
  "research_evidence": [],
  "ai_probes": [],
  "actions": [],
  "sources": [],
  "limitations": []
}

Use numeric scores, ISO dates, canonical URLs, stable finding IDs, and explicit evidence status.

## HUIJIA-specific defaults

When the target is huijiapetgear.com:

- Treat the commercial position as Custom Dog Harness, Collar & Leash Manufacturer; OEM/ODM and Private Label Dog Walking Accessories for Global Pet Brands.
- Audit harnesses, collars, leashes, walking sets, in-stock wholesale products, custom products, About, Factory, Quality/Certification, and Contact as distinct intent groups.
- Prioritize B2B buyer evidence over consumer lifestyle filler.
- Use the supplied SGS or factory audit document only after reading it; never infer its findings from its filename.
- Keep user-approved visual direction: bright, polished, mainstream Western ecommerce presentation.
- Keep English website output and Chinese audit explanations unless instructed otherwise.

## Stop conditions

Stop and report the blocker when:

- The target requires authentication that has not been granted.
- A requested external write, submission, or publication lacks authorization.
- A material company claim has conflicting evidence and the user must decide.
- A certification or legal claim cannot be verified.
- The only way to obtain missing private data is to guess.

Otherwise continue with the best available public-data audit and state the confidence level.
