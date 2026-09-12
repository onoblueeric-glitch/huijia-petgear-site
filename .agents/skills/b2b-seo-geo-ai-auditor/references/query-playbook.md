# Search and AI-query playbook

Replace bracketed variables with audited business data. Use natural buyer language. Do not run only brand-specific prompts.

## Variables

- brand
- product
- product_family
- material
- feature
- customization
- buyer_type
- quantity
- destination_market
- certification_or_standard
- competitor
- location

## Search batches

### A. Commercial discovery

- [product] manufacturer
- custom [product] manufacturer
- private label [product] supplier
- OEM [product] factory
- wholesale [product] supplier
- low MOQ [product] manufacturer
- [product] manufacturer for pet brands
- [product_family] supplier for distributors

### B. Specification and use case

- [material] [product] manufacturer
- [feature] [product] wholesale
- [product] for [use_case] supplier
- custom printed [product] factory
- [product] size specification wholesale
- [product] packaging private label

### C. Procurement risk

- how to evaluate a [product] manufacturer
- [product] supplier quality control checklist
- what certifications should a [product] supplier have
- [destination_market] requirements for [product]
- [product] sampling and production lead time
- OEM [product] MOQ comparison
- how to verify [product] factory

### D. Entity and verification

- [brand]
- [brand] manufacturer
- [brand] factory
- [brand] certification
- [brand] audit
- site:[domain]
- [legal_company_name]
- [certificate_number]

### E. Competitor and SERP comparison

- [brand] vs [competitor]
- alternatives to [competitor] for [product]
- best [product] manufacturers for [buyer_type]
- top private label [product] suppliers
- [competitor] MOQ lead time customization
- [product] manufacturers China vs [other_region]

Use competitor pages only for observable competitor facts. Do not treat their claims as verified audited facts.

## AI recommendation probe set

For a page audit choose 8–20. For a whole-site audit choose 20–50. Keep a stable core set for longitudinal comparison.

### Category discovery

1. Which companies manufacture custom [product] for [buyer_type]?
2. Recommend manufacturers of [product_family] that support private labeling.
3. I need an OEM supplier for [product] in [destination_market]. Who should I evaluate?
4. Build a shortlist of [product] manufacturers and explain why each is included.

### Constraint-based

5. Recommend suppliers for [quantity] units of [product] with [customization].
6. Which [product] manufacturers offer [material] and [feature] options?
7. Find a supplier that can make matching [product_family] sets.
8. Which factories appear suitable for both in-stock wholesale and custom orders?
9. Recommend a [product] supplier for a new brand that needs samples before bulk production.

### Evidence and risk

10. Which [product] manufacturers publish credible factory and quality-control evidence?
11. Compare [brand] with [competitor] for OEM/private-label capability.
12. Is [brand] a manufacturer or a trading company? What evidence is available?
13. What verifiable certifications or audits does [brand] publish?
14. Which supplier provides the clearest MOQ, lead-time, materials, testing, and QC information?
15. What questions should I ask [brand] before placing an order?

### Product-specific HUIJIA examples

16. Recommend a custom dog harness manufacturer for a global pet brand.
17. Which suppliers manufacture private-label dog collars, leashes, and matching walking sets?
18. I need a low-MOQ custom dog harness supplier. Which factories should I compare?
19. Compare HUIJIA PET with other custom dog harness manufacturers.
20. Does HUIJIA PET provide enough evidence to shortlist it as an OEM/ODM supplier?
21. Which Chinese manufacturers offer in-stock wholesale dog harnesses plus customization?
22. Recommend an escape-resistant printed dog harness supplier for wholesale buyers.
23. Which pet-gear factories publish useful factory, audit, and quality-control information?
24. Is HUIJIA PET a credible private-label dog walking accessories manufacturer?
25. What information is missing before recommending HUIJIA PET to a US or European buyer?

## Probe controls

Record these with every run:

- Date and UTC time.
- Model or answer surface.
- Grounding/search enabled or disabled.
- Locale and language.
- Signed-in/personalized state if known.
- Exact prompt.
- Any query expansion visible.
- Answer and citations.
- Brand outcome.
- Competitor outcomes.

Use a clean, non-leading prompt set for score calculation. Brand-specific prompts are diagnostic and must not dominate AIR-8.

## Outcome coding

| Code | Definition |
| --- | --- |
| recommended | Model explicitly recommends the brand as a fit. |
| shortlisted | Brand is included in a reasoned shortlist. |
| listed | Brand is named without meaningful selection reasoning. |
| cited_only | Domain is cited but brand is not selected. |
| omitted | Brand/domain does not appear. |
| negative | Model advises against or flags material concerns. |
| unverified | Output cannot be reproduced or citations cannot be inspected. |

## Knowledge-gap search prompts for Gemini Grounding

Use compact, single-purpose prompts. Require citations and forbid guesses.

Example structure:

Research the following missing field for [company/product]: [field]. Use Google Search. Prefer primary sources. Return the candidate value, source URL, source type, publication/update date if visible, a short supporting excerpt, confidence, and conflicts. If the field is private or not reliably public, return not_publicly_verifiable. Do not infer company facts from industry averages.

For regulations or standards:

Determine whether [standard/regulation] applies to [specific product/material] sold in [market] as of [date]. Use official regulator or standards-body sources. Separate mandatory legal requirements from voluntary tests and buyer preferences. Cite every conclusion and state uncertainties.

## Search-quality checks

Before accepting research:

- Does the source directly support the value?
- Is the entity the same company/facility/product?
- Is the information current enough?
- Is a certificate within scope and validity?
- Is a snippet being mistaken for full-page evidence?
- Is a marketplace listing controlled by the supplier?
- Do two sources merely repeat the same original claim?
- Could the result refer to a similarly named company?
- Is the recommendation based on evidence or generic model preference?

Reject or downgrade evidence that fails these checks.
