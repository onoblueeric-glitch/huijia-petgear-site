# B2B manufacturer knowledge-base schema

Use this schema to identify what the site and AI systems can reliably know about the business.

For every field store:

- field_id
- category
- field_name
- value
- unit
- applicable_products
- applicable_markets
- evidence_status
- source
- retrieved_at
- last_verified_at
- owner
- public_safe
- notes

Do not require every field on every page. Store facts centrally, then place each fact on the page where it best matches buyer intent.

## 1. Entity and contact

| Field ID | Field | Typical source | Public research? |
| --- | --- | --- | --- |
| ENT-001 | Brand name | Company/site | Yes |
| ENT-002 | Legal company name | Registration/audit document | Sometimes |
| ENT-003 | Business type | Company evidence | Sometimes |
| ENT-004 | Year established | Registration/audit document | Sometimes |
| ENT-005 | Factory and office locations | Audit/company evidence | Sometimes |
| ENT-006 | Primary contacts | Company/site | Yes |
| ENT-007 | Official domains and emails | Company/site | Yes |
| ENT-008 | Target markets and buyer types | Internal strategy | No |
| ENT-009 | Languages supported | Company/site | Yes |
| ENT-010 | Business registrations and identifiers | Official record | Sometimes |

## 2. Product taxonomy

For each product family capture:

- Canonical product-family name.
- Synonyms and buyer-language variants.
- Target buyer.
- Custom, in-stock, wholesale, or mixed availability.
- Materials.
- Construction.
- Sizes and fit range.
- Color and print options.
- Hardware and component options.
- Safety/functional features.
- Intended uses and exclusions.
- Packaging.
- MOQ.
- Sample availability.
- Production lead time.
- Stock dispatch time.
- Target markets.
- Applicable standards/tests.
- Product images, drawings, and downloadable documents.

Core HUIJIA groups:

- Dog harnesses.
- Dog collars.
- Dog leashes.
- Dog walking sets.
- In-stock wholesale products.
- Custom/OEM/ODM/private-label products.

## 3. Customization and development

| Field ID | Field |
| --- | --- |
| DEV-001 | OEM, ODM, and private-label scope |
| DEV-002 | Logo methods |
| DEV-003 | Print and pattern methods |
| DEV-004 | Color matching |
| DEV-005 | Material substitution or sourcing |
| DEV-006 | Hardware customization |
| DEV-007 | Packaging customization |
| DEV-008 | Design-file requirements |
| DEV-009 | Sampling steps |
| DEV-010 | Sample cost and timing |
| DEV-011 | Revision policy |
| DEV-012 | Tooling/mold requirements |
| DEV-013 | Intellectual-property handling |
| DEV-014 | Development-to-production workflow |

## 4. Manufacturing capacity

| Field ID | Field |
| --- | --- |
| MFG-001 | Factory ownership/relationship |
| MFG-002 | Factory area |
| MFG-003 | Employee count |
| MFG-004 | Production lines |
| MFG-005 | Key equipment |
| MFG-006 | Processes performed in-house |
| MFG-007 | Outsourced processes |
| MFG-008 | Monthly capacity by product |
| MFG-009 | Peak-season constraints |
| MFG-010 | Standard lead time |
| MFG-011 | Rush-order capability |
| MFG-012 | Typical order range |
| MFG-013 | MOQ by product/customization |
| MFG-014 | Capacity evidence date |

These are usually internal or document-extractable. Never replace missing values with industry averages.

## 5. Quality and traceability

| Field ID | Field |
| --- | --- |
| QMS-001 | Incoming-material inspection |
| QMS-002 | In-process inspection |
| QMS-003 | Final inspection |
| QMS-004 | AQL or sampling method |
| QMS-005 | Test equipment |
| QMS-006 | Product tests |
| QMS-007 | Batch/lot traceability |
| QMS-008 | Defect handling |
| QMS-009 | Corrective-action process |
| QMS-010 | Pre-shipment inspection options |
| QMS-011 | Quality records retained |
| QMS-012 | Warranty/claim handling |

## 6. Certification and compliance

For each record capture:

- Exact certificate/report title.
- Issuing or auditing body.
- Standard or program.
- Certificate/report number.
- Scope.
- Legal entity/facility covered.
- Issue date.
- Expiry date or validity status.
- Public verification URL when available.
- Supplied file.
- Which marketing claims it supports.
- Which claims it does not support.

Never turn a factory audit into a product certification.

Potential product/market compliance fields must be researched for the specific material, product, and destination. Do not assume applicability.

## 7. Commercial and logistics

- Incoterms.
- Payment methods and deposit terms.
- Sample ordering process.
- Production lead time.
- Stock dispatch time.
- Shipping methods.
- Export packaging.
- Carton data.
- Label/barcode support.
- Consolidation or drop-shipping capability.
- Main ports.
- Documentation provided.
- After-sales and defect resolution.
- Quote validity.
- Confidentiality/NDA support.

## 8. Proof assets

- Factory audit reports.
- Certificates.
- Test reports.
- Production photos/videos.
- Equipment list.
- Quality-control records.
- Product drawings/spec sheets.
- Packaging examples.
- Case studies.
- Trade-show or association evidence.
- Public business profiles.
- Customer references where permitted.

Each asset needs a title, date, owner, applicable claims, public-safe flag, and stable URL or file identity.

## 9. Content and query map

For every priority query cluster store:

- Query-cluster ID.
- Search intent.
- Funnel stage.
- Buyer persona.
- Market/language.
- Primary page URL.
- Supporting page URLs.
- Required entities and facts.
- Required proof.
- Internal-link sources.
- Schema type.
- Conversion action.
- Current rank/click/impression data when available.
- Last audit score.

## 10. Gap classification

Classify missing fields:

| Class | Action |
| --- | --- |
| public_researchable | Search authoritative public sources and store citations. |
| internal_answerable | Ask the company owner or responsible team. |
| document_extractable | Read a supplied certificate, audit, catalog, or report. |
| measurement_required | Run a test, crawl, analytics query, or performance measurement. |
| third_party_validation_required | Obtain audit, certification, test, review, or external reference. |
| unknowable | Leave blank; do not infer. |

## Gap priority

Priority score = visibility impact + buyer-risk impact + conversion impact + reuse across pages, each rated 0–3.

- 10–12: P0 knowledge gap.
- 7–9: P1 knowledge gap.
- 4–6: P2 knowledge gap.
- 0–3: backlog.

Add legal or claim-safety urgency separately. A high-risk unsupported public claim is P0 even if its visibility score is low.
