# On-Page SEO Guide — Health Metro

> Rules for every page created. Non-negotiable.

---

## The "Perfect Page" Formula

Every Health Metro page must satisfy these criteria before publishing:

```
Title Tag        ✅ Unique | 50–60 chars | Primary KW near front
Meta Description ✅ Unique | 120–160 chars | CTA included
H1               ✅ One per page | Contains primary keyword
H2–H3            ✅ Keyword variations | Clear topic hierarchy
Body Content     ✅ 800+ words (info) | 300+ words (commercial)
Images           ✅ Descriptive alt text | WebP | Correct dimensions
Internal Links   ✅ 3–5 links to relevant pages
Schema           ✅ Appropriate type deployed
URL              ✅ Short | Keyword-rich | Hyphenated
```

---

## Title Tag Formulas

### Home Page
```
Health Metro — [Primary Value Prop] | [Brand]
Example: "Connecting Health Globally — Find & Access International Healthcare | Health Metro"
```

### Blog / Informational
```
[Number] [Keyword] [Benefit] — Health Metro
Example: "12 Best Countries for Medical Treatment in 2026 — Health Metro"
```

### Commercial / Solutions Pages
```
[Service] for [Audience] | Health Metro
Example: "Global Healthcare Connectivity for Hospitals | Health Metro"
```

### FAQ / Resource Pages
```
[Question answered] | Health Metro
Example: "Can I Use My Health Insurance Abroad? | Health Metro"
```

---

## Meta Description Formulas

### Informational
```
Discover [topic] + [key insight] + [reason to click].
Example: "Discover how medical tourism works, the best countries to visit, and how to save up to 70% on healthcare costs. Your complete 2026 guide."
```

### Commercial
```
[Brand] helps [audience] [achieve outcome]. [CTA].
Example: "Health Metro helps hospitals attract international patients effortlessly. List your facility and connect globally today."
```

---

## Heading Structure Template

```markdown
# H1: Primary Keyword + Intent Match

## H2: First Major Subtopic
### H3: Specific Sub-point
### H3: Specific Sub-point

## H2: Second Major Subtopic
### H3: Specific Sub-point

## H2: FAQ / Common Questions (AEO opportunity)
### H3: Question 1?
### H3: Question 2?

## H2: Conclusion / CTA
```

---

## Content Rules (EEAT Standards)

### For Health Content (Your Money Your Life — YMYL)
These are Google's highest scrutiny pages. Health content MUST have:

1. **Author byline** with credentials (MD, RN, PHD, etc.)
2. **Medical review date** ("Medically reviewed: April 2026")
3. **Citations** from authoritative sources:
   - WHO (who.int)
   - NHS (nhs.uk)
   - CDC (cdc.gov)
   - Peer-reviewed journals (PubMed, Lancet)
4. **Medical disclaimer** at top of health-specific pages
5. **"About the Author"** section at bottom

### Content Depth Requirements
| Page Type | Min Word Count | Key Elements |
|---|---|---|
| Pillar / Guide | 3,000+ | Table of contents, stats, images, FAQs |
| Blog Post | 1,200+ | Intro, body, CTA, 1–2 images |
| Solutions Page | 600+ | Value props, social proof, CTA |
| Directory Page | 300+ | Structured data, maps, contact info |
| FAQ Page | 200+ per Q | Direct answer first, then elaboration |

---

## Internal Linking Rules

- Every new blog post must link to at least 1 **pillar page**
- Every pillar page must link to all its **cluster pages**
- Use **descriptive anchor text** — never "click here" or "read more"
- Link to **conversion pages** from top-performing informational posts

### Anchor Text Examples
❌ `Click here to learn more`
✅ `Learn how medical tourism pricing works`

❌ `Read more`
✅ `Compare healthcare costs by country`

---

## Image SEO Rules

- **Format:** WebP (convert all JPG/PNG)
- **Size:** < 150KB per image ideally
- **Alt text formula:** `[What's in image] + [relevant keyword if natural]`
  - ❌ `"photo"` or `"image"`
  - ❌ Keyword stuffing: `"health metro medical tourism healthcare"`
  - ✅ `"Doctor consulting international patient via video call"`
- **File names:** `international-hospital-accreditation.webp` (descriptive, hyphenated)
- **Dimensions:** Specify `width` and `height` in HTML to prevent CLS

---

## Page Speed On-Page Rules

- Defer non-critical JavaScript
- `loading="lazy"` on all below-fold images
- `priority` / eager loading on hero/LCP images
- No render-blocking CSS in `<head>` (inline critical CSS)
- Preconnect to external fonts: `<link rel="preconnect" href="https://fonts.googleapis.com">`
