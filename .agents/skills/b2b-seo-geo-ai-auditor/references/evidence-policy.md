# Evidence and research policy

## Evidence ledger

Create one record for every material fact or score-driving observation.

Required fields:

| Field | Meaning |
| --- | --- |
| evidence_id | Stable identifier such as EV-SEO-001. |
| claim | The exact fact or observation. |
| status | verified_internal, verified_site, verified_public, corroborated_public, inferred, missing, conflicting, or unsafe_claim. |
| source_type | user_document, site_page, technical_test, official_source, external_source, competitor_page, search_result, ai_probe, or none. |
| source_url_or_file | Canonical URL or exact supplied filename. |
| retrieved_at | ISO date/time when available. |
| excerpt_or_observation | Short supporting text or a concise technical observation. |
| supports | Finding IDs and scoring criteria supported by this evidence. |
| confidence | high, medium, or low. |
| notes | Limitations, conflicts, or required follow-up. |

## Fact handling

### May be stated as fact

- A statement directly visible on the audited site, described as a site claim.
- A statement in a user-supplied authoritative company document, with the document named.
- A public fact supported by a primary or authoritative source.
- A public fact supported by multiple credible independent sources, labeled corroborated.

### Must be qualified

- Competitor estimates.
- Search-volume or traffic estimates.
- Model interpretations.
- Likely page intent.
- Apparent manufacturing capability inferred from imagery.
- Industry norms applied to a company.

Use language such as appears, indicates, estimates, or could not be independently verified.

### Must never be invented

- Factory size.
- Employee count.
- Production capacity.
- MOQ.
- Lead time.
- Export countries.
- Certifications or certificate validity.
- Audit scores.
- Client names.
- Revenue, orders, or market share.
- Material compliance.
- Test results.
- Warranty or service terms.

If these are missing, add them to the knowledge-gap table.

## Source priority

Prefer primary sources. For technical questions, use official documentation.

A source supports only the specific claim it actually establishes. Do not cite a homepage for a detailed claim found nowhere on that page.

Use direct page links, not search-result URLs. Put citations close to claims.

## Freshness

Treat these as time-sensitive and research them again:

- Current search results.
- AI model outputs and product capabilities.
- Search-engine guidance.
- Regulations and standards.
- Certificate validity.
- Competitor offerings, pricing, MOQ, and lead time.
- Site performance.
- Product availability.
- Company contacts and business status.

Record retrieval date. Do not silently reuse stale observations.

## Research stopping rule

Research until one of these is true:

- A primary source answers the question.
- Two credible independent sources corroborate a public fact.
- Reasonable targeted searches return no reliable evidence.
- The fact is clearly private/internal.
- Additional searching is unlikely to change the recommendation.

Do not pad reports with unrelated sources.

## Knowledge-base update rule

A researched value may enter the knowledge base only when:

- Its field is public-researchable.
- The value is directly supported.
- Source URL, retrieval date, and evidence status are stored.
- It does not contradict verified internal evidence.
- It is not being copied from a competitor as if it belongs to the audited company.

When evidence conflicts:

1. Preserve all conflicting records.
2. Mark the field conflicting.
3. Do not select a definitive value.
4. Ask for internal verification if it is a company fact.
5. Reduce evidence confidence where the conflict matters.

## AI answer evidence

For each AI probe, store:

- Exact prompt.
- Prompt class.
- Date/time.
- Language and locale.
- Model or answer surface.
- Whether web grounding/search was enabled.
- Brand mention.
- Recommendation strength: recommended, shortlisted, listed, cited_only, omitted, or negative.
- Domain citation.
- Competitors mentioned.
- URLs cited.
- Short rationale extracted from the answer.
- Limitations.

An AI output is evidence of that one observed answer, not evidence that every user receives the same result.

## Claim safety

Flag unsafe_claim when:

- A certificate cannot be matched to an issuing body or supplied document.
- A statement implies official approval without proof.
- A product safety/compliance claim exceeds available tests.
- A superlative such as best, leading, number one, or guaranteed has no defensible basis.
- Customer logos or names appear without evidence or permission.
- Review/schema markup is not supported by genuine visible reviews.

Recommend precise factual replacement language.
