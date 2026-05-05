# Technical SEO Checklist — Health Metro

> Run this checklist on every major deploy and quarterly audit.

---

## ✅ Core Web Vitals (Pass Required)

| Metric | Target | Tool to Measure |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | PageSpeed Insights |
| **FID/INP** (Interaction to Next Paint) | < 200ms | Chrome UX Report |
| **CLS** (Cumulative Layout Shift) | < 0.1 | PageSpeed Insights |
| **TTFB** (Time to First Byte) | < 800ms | GTmetrix |

### Fix Checklist
- [ ] Images: WebP format, correct `width` and `height` attrs, lazy loading
- [ ] Hero image: `priority` prop in Next.js Image (preloaded, no lazy)
- [ ] Fonts: `font-display: swap`, preconnect to Google Fonts
- [ ] No layout shift on font load or dynamic content injection
- [ ] CDN for all static assets

---

## ✅ Crawlability & Indexability

- [ ] `robots.txt` present and correct — allow all important paths
- [ ] XML Sitemap at `/sitemap.xml` — submitted to Google Search Console
- [ ] No accidental `noindex` tags on public pages
- [ ] Canonical tags on all pages (self-referencing)
- [ ] Hreflang tags if serving multiple languages/regions
- [ ] No broken links (404s) — use Screaming Frog or Ahrefs

```txt
# /public/robots.txt (example)
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Sitemap: https://healthmetro.com/sitemap.xml
```

---

## ✅ URL & Redirect Structure

- [ ] HTTPS enforced on all URLs
- [ ] `www` vs non-`www` — choose one, 301 redirect the other
- [ ] No redirect chains (A → B → C) — collapse to A → C
- [ ] Trailing slash consistent (pick one, enforce site-wide)
- [ ] No URL parameters polluting the index (use canonical or `noindex`)

---

## ✅ On-Page Technical Elements

- [ ] Every page has a unique `<title>` tag (50–60 chars)
- [ ] Every page has a unique `<meta name="description">` (120–160 chars)
- [ ] One `<h1>` per page — contains primary keyword
- [ ] Logical `<h2>` → `<h3>` heading hierarchy
- [ ] All images have descriptive `alt` text
- [ ] Internal linking — every page linked to from at least 2 others

---

## ✅ Schema.org Structured Data (Critical for GEO & AEO)

### Organization Schema (site-wide)
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "name": "Health Metro",
  "url": "https://healthmetro.com",
  "logo": "https://healthmetro.com/logo.png",
  "description": "Connecting Health Globally — the world's platform for international healthcare connectivity.",
  "sameAs": [
    "https://twitter.com/healthmetro",
    "https://linkedin.com/company/healthmetro",
    "https://en.wikipedia.org/wiki/Health_Metro"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "availableLanguage": "English"
  }
}
```

### Website Schema (home page)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Health Metro",
  "url": "https://healthmetro.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://healthmetro.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### BreadcrumbList (all inner pages)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://healthmetro.com" },
    { "@type": "ListItem", "position": 2, "name": "Medical Tourism", "item": "https://healthmetro.com/blog/medical-tourism" }
  ]
}
```

---

## ✅ International SEO (If Multi-Region)

- [ ] Hreflang tags declare language/region per URL
- [ ] Translated content is unique (not machine-translated without review)
- [ ] Currency/units/dates localized
- [ ] Country-specific domains or subdirectories (e.g., `/in/`, `/uk/`)

---

## ✅ Security & Trust Signals

- [ ] SSL certificate valid and auto-renewing
- [ ] HSTS header enabled
- [ ] Privacy Policy page (`/privacy-policy`) — linked in footer
- [ ] Terms of Service page (`/terms`) — linked in footer
- [ ] Medical disclaimer page (required for health content)
- [ ] Cookie consent banner (GDPR compliance)

---

## ✅ Mobile & Accessibility

- [ ] 100% responsive — test on 320px, 768px, 1440px viewports
- [ ] Touch targets ≥ 48px
- [ ] Color contrast ratio ≥ 4.5:1 (WCAG AA) — Teal on white ✅
- [ ] `lang` attribute on `<html>` element
- [ ] No horizontal scroll on mobile
