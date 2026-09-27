# Quote-only product metadata correction

Search Console reported 7 invalid Product items on 2026-09-27: offers, review or aggregateRating missing. Source inspection found the same pattern on 107 pages (106 detail pages and two nested items on one collection page), totaling 108 Product nodes.

These pages require a quotation; no verified public prices or customer reviews were available. Removed the ineligible Product nodes, kept WebPage descriptions/images and all BreadcrumbList/FAQ/Organization metadata, and changed the collection entries to links to the existing detail pages. No Product was relabeled as a Service. All visible HTML, URLs, titles, product identifiers, specifications, photos, navigation, CSS and inquiry behavior are unchanged.

Product rich results are intentionally not requested until genuine supported offers or reviews are published visibly. This correction does not guarantee indexing or ranking changes. Search Console requires recrawling/validation before historical errors disappear.

Validation: all 131 HTML source files inspected; all 135 JSON-LD blocks parsed; no remaining Product nodes or dangling #product references. Non-JSON-LD content of every changed page was compared byte-for-byte with its original. Regression tests cover missing eligibility at both graph and nested collection levels. The site validator now flags quote-only Product markup instead of explicitly allowing it.

Official reference: https://developers.google.com/search/docs/appearance/structured-data/product-snippet
