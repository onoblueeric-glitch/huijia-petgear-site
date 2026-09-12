# Fixed scoring rubric

Use integer points. Award partial points only when the evidence supports a clear fraction of the criterion. Round final scores to the nearest whole number.

A score of 90 or more means the audited implementation is strong against this rubric. It does not guarantee rankings, AI citations, or recommendations.

## SEO score: 100 points

| ID | Criterion | Weight | Full-credit evidence |
| --- | --- | ---: | --- |
| SEO-1 | Crawlability and indexability | 15 | Important URLs return valid responses, are crawlable and indexable, have correct robots directives, and appear in valid XML sitemaps. |
| SEO-2 | Canonical and technical hygiene | 10 | Correct canonicals, redirects, protocol/host consistency, no material duplication, valid hreflang when needed, and clean URL behavior. |
| SEO-3 | Search intent and keyword mapping | 15 | Each important query cluster has one clear primary page; no severe cannibalization; page type matches buyer intent. |
| SEO-4 | On-page relevance | 15 | Specific title, description, H1/H2 structure, copy, image context, and calls to action accurately describe the offering without stuffing. |
| SEO-5 | Information architecture and internal links | 15 | Logical navigation, breadcrumbs, contextual links, discoverable categories/products, no important orphan pages, and useful anchor text. |
| SEO-6 | Commercial and informational completeness | 10 | Page answers the main buyer questions and supports conversion at the appropriate depth for its page type. |
| SEO-7 | Structured data and media | 10 | Appropriate valid schema, supported by visible content; useful image names, alt text, dimensions, formats, and media semantics. |
| SEO-8 | Mobile experience, performance, and accessibility | 10 | Usable mobile layout, stable rendering, acceptable performance evidence, accessible basics, and no disruptive overlays. |

### SEO caps

Apply the lowest relevant cap after subtotaling:

- Material target page intentionally or accidentally noindex: maximum 40.
- Target page blocked from crawling: maximum 45.
- Target page returns persistent 4xx/5xx or soft-404 behavior: maximum 25.
- Canonical points to an unrelated or non-equivalent URL: maximum 60.
- Entire commercial site has no discoverable navigation or sitemap path to important pages: maximum 65.
- Audit is based only on a screenshot with no URL/source access: maximum score may be reported as provisional, and confidence must be 35 or lower.

### SEO penalties

Do not double-deduct an issue already fully represented in a criterion.

- Doorway, cloaking, hidden keyword, or scaled low-value page pattern: minus 5 to 20.
- Material structured-data claims unsupported by visible content: minus 3 to 10.
- Severe repeated titles/H1s across priority pages: minus 2 to 8.
- Intrusive UI that blocks primary content or conversion: minus 2 to 8.

## GEO score: 100 points

GEO means the site's ability to be understood, selected, summarized, and cited by generative answer systems. It is not a Google-owned metric.

| ID | Criterion | Weight | Full-credit evidence |
| --- | --- | ---: | --- |
| GEO-1 | Entity identity and consistency | 15 | Clear legal/brand identity, business type, location, contact, products, markets, and consistent entity facts across important pages. |
| GEO-2 | Claim-to-evidence quality | 20 | Material capability, factory, certification, performance, and quality claims have accessible, specific evidence and provenance. |
| GEO-3 | Answerability and extraction | 15 | Concise direct answers, descriptive headings, specification tables, FAQs, definitions, and self-contained passages answer buyer questions. |
| GEO-4 | Topic and buyer-question coverage | 15 | Covers the entity, products, specifications, customization, quality, compliance, production, logistics, and procurement questions needed for the target intent. |
| GEO-5 | Source and citation readiness | 10 | Facts include dates, document names, issuing bodies, authors/owners where relevant, stable URLs, and clear source relationships. |
| GEO-6 | Semantic structure | 10 | Helpful HTML hierarchy, schema, breadcrumbs, tables/lists, entity relationships, and consistent terminology support machine interpretation. |
| GEO-7 | Freshness and maintenance signals | 5 | Time-sensitive facts are dated and maintained; obsolete claims and broken references are controlled. |
| GEO-8 | External corroboration and entity footprint | 10 | Important identity and credibility facts are corroborated by credible external profiles, certifications, directories, media, partners, or regulatory sources. |

### GEO caps

- Material company claims conflict across pages or sources and are unresolved: maximum 70.
- Core business identity is unclear or inconsistent: maximum 65.
- Major certification/factory claims are unsupported or misleading: maximum 55.
- Page/site provides almost no extractable factual content: maximum 50.
- Only screenshot evidence is available: provisional maximum 70 and confidence 35 or lower.

### GEO penalties

- Fabricated or unverifiable named certification, client, test, award, or performance claim: minus 10 to 30 and mark unsafe_claim.
- AI-written generic filler that displaces useful facts: minus 2 to 10.
- FAQ/schema content not visible to users: minus 3 to 10.
- False freshness or misleading update dates: minus 3 to 10.

## AI Recommendation score: 100 points

This score estimates recommendation readiness for realistic buyer prompts. It does not claim universal model visibility.

| ID | Criterion | Weight | Full-credit evidence |
| --- | --- | ---: | --- |
| AIR-1 | Query and buyer-fit clarity | 15 | The site clearly matches target supplier, product, region, quantity, customization, and buyer-type constraints. |
| AIR-2 | Manufacturer capability evidence | 20 | Specific, verified proof of factory role, development, production, quality control, capacity, lead time, and OEM/ODM/private-label capability. |
| AIR-3 | Product and specification completeness | 15 | Useful materials, construction, sizes, colors, options, MOQ, packaging, compliance, application, and availability data. |
| AIR-4 | Trust and procurement-risk reduction | 15 | Clear contact/accountability, audit/certification evidence, sample process, quality controls, terms, delivery, issue resolution, and buyer safeguards. |
| AIR-5 | Differentiation and comparison value | 10 | Verifiable differentiators, ideal-fit statements, tradeoffs, use cases, and comparison-ready facts without unsupported superiority claims. |
| AIR-6 | Third-party corroboration | 10 | Credible external evidence supports identity, capabilities, certification, reputation, or market presence. |
| AIR-7 | Citation-ready information | 10 | Stable, specific, attributable passages and source documents are easy for answer systems to cite. |
| AIR-8 | Observed AI probe performance | 5 | Repeatable prompt sample shows relevant mentions, recommendations, or domain citations. |

### AI Recommendation caps

- No verifiable manufacturer/supplier identity: maximum 50.
- Serious unsupported certification, factory, or client claims: maximum 45.
- Product pages lack core commercial specifications and inquiry path: maximum 65.
- No external corroboration is found after reasonable research: maximum 85.
- No live AI probes were run: AIR-8 receives 0, but other criteria remain scoreable.
- Fewer than eight probes for a page or twenty for a whole site: AIR-8 maximum 3.

### Probe scoring for AIR-8

For the defined sample:

- 5: recommended or strongly shortlisted in at least 25 percent of relevant probes and cited/linked in at least one credible answer.
- 4: mentioned or shortlisted in at least 20 percent, with meaningful factual support.
- 3: appears in at least 10 percent or is cited without a recommendation.
- 2: appears only in brand-specific prompts.
- 1: sporadic ambiguous appearance.
- 0: not observed, probes not run, or results cannot be verified.

Report numerator, denominator, prompt set, model/surface, locale, and date. Never extrapolate the sample into total AI market visibility.

## Evidence confidence score: 100 points

| ID | Criterion | Weight |
| --- | --- | ---: |
| CONF-1 | Live technical/page access | 20 |
| CONF-2 | Coverage of priority URLs | 15 |
| CONF-3 | Internal/company evidence availability | 20 |
| CONF-4 | Primary/authoritative external sources | 15 |
| CONF-5 | Current competitive/SERP research | 10 |
| CONF-6 | AI probe breadth and reproducibility | 10 |
| CONF-7 | Analytics/Search Console/performance evidence | 10 |

Confidence describes audit reliability, not site quality.

## Score interpretation

| Range | Interpretation |
| ---: | --- |
| 90–100 | Strong and evidence-ready; remaining work is refinement or external authority growth. |
| 80–89 | Competitive foundation with identifiable gaps preventing consistent discovery or recommendation. |
| 70–79 | Viable but incomplete; several high-impact content, evidence, or architecture gaps remain. |
| 60–69 | Weak foundation; major relevance, trust, or technical improvements are needed. |
| Below 60 | Material blockers or insufficient evidence make visibility and recommendation unlikely. |

## Comparison rules

When comparing pages or competitors:

- Use the same audit scope, market, language, query set, date window, and weights.
- Show unavailable evidence rather than assuming absence.
- Do not score private competitor data.
- Separate observable implementation from estimated business strength.
- A visually attractive page receives points only where it improves usability, extraction, evidence, or conversion.
