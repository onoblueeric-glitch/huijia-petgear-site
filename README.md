# HUIJIA PET Static Website

Deploy-ready static website for GitHub + Vercel.

## 1. Edit company information

Open `assets/js/site-config.js` and replace:

- `siteUrl`
- `emailContacts`
- `whatsappContacts`
- `videoUrl`
- `formEndpoint`

Forms use the Vercel `/api/rfq` endpoint when SMTP is configured. Until then, visitors explicitly choose a prepared email or WhatsApp message. All inquiries route to the single configured sales contact. See [INQUIRY-SETUP.md](INQUIRY-SETUP.md) for server-side setup and the inbox acceptance check.

## 2. Replace temporary images

The current design preserves external Unsplash placeholders from the supplied homepage. Replace every external image with real HUIJIA product, factory, testing, certificate and customer-case media before public launch. Search for `images.unsplash.com` in `index.html` and `assets/css/styles.css`.

## 3. Update claims before launch

Verify and replace all sample figures and claims, including founding year, years of OEM experience, designs, export markets, sample lead time, certificates, reviews and customer cases. Never publish certificates or testimonials that cannot be substantiated.

## 4. Local preview

The announcement bar, header, menu, and footer use `partials/site-header.html` and
`partials/site-footer.html`, based on the leash category page. Edit those shared
templates rather than individual pages, then run `npm run sync:shell` followed by
`npm run check` before committing. Commit the generated HTML alongside the templates.
Vercel serves these synchronized pages using the existing static deployment settings.
Navigation stays in the static HTML, including when JavaScript is disabled.
`assets/css/brand-shell.css` is loaded last with a content-based cache version.

Product photos use responsive 800px delivery copies and the original files for
larger displays. With Pillow installed, `python scripts/optimize-images.py`
regenerates these copies and updates the static image attributes; then run the
shell synchronization and validation commands above. Keep `srcset` in sync when
adding gallery controls or product/on-pet switches. Changed JS and CSS URLs must
receive a new content version so returning visitors load the updated behavior.

The resource pages use a Latin subset of the original Inter variable font. The
source font remains in `assets/fonts/InterVariable.woff2`; the delivery file keeps
the same weights and shapes, with normal browser fallback for other scripts.

Open `index.html` directly, or run:

```bash
npm run dev
```

## 5. Deploy with GitHub + Vercel

1. Create a GitHub repository.
2. Upload all files in this folder to the repository root.
3. In Vercel, select **Add New → Project** and import the repository.
4. Framework preset: **Other**.
5. Build command: leave blank.
6. Output directory: leave blank or use `.`.
7. Deploy.
8. Add the purchased domain in **Project Settings → Domains**.

## 6. Domain replacement

The production package uses `https://www.huijiapetgear.com` in canonical, JSON-LD, `robots.txt`, `sitemap.xml`, and `site-config.js`. Configure `huijiapetgear.com` in Vercel as a permanent redirect to the `www` domain.
