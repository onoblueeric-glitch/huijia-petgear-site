# HUIJIA PET Static Website

Deploy-ready static website for GitHub + Vercel.

## 1. Edit company information

Open `assets/js/site-config.js` and replace:

- `siteUrl`
- `email`
- `whatsappNumber` and `whatsappDisplay`
- `videoUrl`
- `formEndpoint`

The default form behavior opens the visitor's email app. For direct online submission, create a Formspree/Web3Forms endpoint and put it in `formEndpoint`, or connect your CRM/API.

## 2. Replace temporary images

The current design preserves external Unsplash placeholders from the supplied homepage. Replace every external image with real HUIJIA product, factory, testing, certificate and customer-case media before public launch. Search for `images.unsplash.com` in `index.html` and `assets/css/styles.css`.

## 3. Update claims before launch

Verify and replace all sample figures and claims, including founding year, years of OEM experience, designs, export markets, sample lead time, certificates, reviews and customer cases. Never publish certificates or testimonials that cannot be substantiated.

## 4. Local preview

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
