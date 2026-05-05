# Structured Data Guide — Health Metro

> Complete Schema.org markup library. Deploy all applicable schemas.

---

## Priority Deployment Order

| Priority | Schema Type | Where | Impact |
|---|---|---|---|
| P0 | Organization / MedicalOrganization | Site-wide (layout) | Brand identity in AI |
| P0 | WebSite (Sitelinks SearchBox) | Home page | Search presence |
| P1 | FAQPage | All FAQ sections | AEO + GEO |
| P1 | BreadcrumbList | All inner pages | Navigation + AI context |
| P2 | Article / MedicalWebPage | Blog posts | Content authority |
| P2 | HowTo | How-to articles | Featured snippets |
| P3 | MedicalOrganization (Hospitals) | Directory pages | Vertical authority |
| P3 | SpeakableSpecification | Key content | Voice search |

---

## Complete Schema Library

### 1. Organization (Site-Wide — in `<head>` of layout)

```json
{
  "@context": "https://schema.org",
  "@type": ["Organization", "MedicalOrganization"],
  "@id": "https://healthmetro.com/#organization",
  "name": "Health Metro",
  "alternateName": "HealthMetro",
  "url": "https://healthmetro.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://healthmetro.com/logo.png",
    "width": "512",
    "height": "512"
  },
  "description": "Health Metro is the global platform connecting patients with international healthcare providers. Connecting Health Globally.",
  "slogan": "Connecting Health Globally",
  "foundingDate": "2024",
  "areaServed": "Worldwide",
  "knowsAbout": [
    "Medical Tourism",
    "Global Healthcare",
    "International Patient Services",
    "Healthcare Connectivity",
    "Telemedicine"
  ],
  "sameAs": [
    "https://twitter.com/healthmetro",
    "https://linkedin.com/company/healthmetro",
    "https://facebook.com/healthmetro",
    "https://instagram.com/healthmetro",
    "https://en.wikipedia.org/wiki/Health_Metro"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "availableLanguage": ["English", "Hindi", "Arabic", "Spanish"]
  }
}
```

---

### 2. WebSite (Home Page — enables Sitelinks SearchBox)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://healthmetro.com/#website",
  "name": "Health Metro",
  "url": "https://healthmetro.com",
  "publisher": {
    "@id": "https://healthmetro.com/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://healthmetro.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

---

### 3. FAQPage (FAQ Pages & Blog FAQs)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is medical tourism?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Medical tourism is the practice of traveling to another country to receive medical care, typically to access better quality, lower cost, or faster treatment than available locally."
      }
    },
    {
      "@type": "Question",
      "name": "How does Health Metro work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Health Metro is a global platform that connects patients with accredited international healthcare providers. Patients can search hospitals by country, specialty, and accreditation, compare costs, and connect directly with providers."
      }
    },
    {
      "@type": "Question",
      "name": "Is medical treatment abroad safe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, when you choose accredited hospitals through a verified platform like Health Metro. We only list hospitals with recognized international accreditations such as JCI (Joint Commission International) and NABH."
      }
    }
  ]
}
```

---

### 4. Article (Blog Posts)

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "headline": "[Article Title]",
  "description": "[Meta description]",
  "url": "https://healthmetro.com/blog/[slug]",
  "datePublished": "2026-04-01",
  "dateModified": "2026-04-26",
  "author": {
    "@type": "Person",
    "name": "[Author Name]",
    "jobTitle": "[Title, MD/PhD etc]",
    "url": "https://healthmetro.com/authors/[slug]"
  },
  "publisher": {
    "@id": "https://healthmetro.com/#organization"
  },
  "medicalAudience": {
    "@type": "MedicalAudience",
    "audienceType": "Patient"
  },
  "about": {
    "@type": "MedicalCondition",
    "name": "[Relevant condition if applicable]"
  }
}
```

---

### 5. HowTo (Step-by-Step Articles)

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Find a Hospital Abroad",
  "description": "A step-by-step guide to finding and booking accredited international healthcare through Health Metro.",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Search by Country or Specialty",
      "text": "Use Health Metro's directory to filter hospitals by country, medical specialty, and accreditation type.",
      "url": "https://healthmetro.com/directory"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Compare Providers",
      "text": "Review accreditations, patient ratings, treatment costs, and available specialists for each hospital."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Request a Consultation",
      "text": "Submit your medical history and treatment request directly to the hospital through our secure platform."
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Receive a Treatment Plan",
      "text": "The hospital's international patient coordinator will contact you with a personalized treatment plan and cost estimate."
    }
  ]
}
```

---

### 6. BreadcrumbList (All Inner Pages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://healthmetro.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Medical Tourism Guide",
      "item": "https://healthmetro.com/blog/medical-tourism"
    }
  ]
}
```

---

### 7. SpeakableSpecification (Voice Search / AEO)

Add to pages with content ideal for voice assistants:

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".speakable-summary", "h1", ".key-facts"]
  }
}
```

Mark these HTML elements in your page:
```html
<div class="speakable-summary">
  Health Metro is the global platform connecting patients with 
  international healthcare providers in over 50 countries. 
  Our tagline is Connecting Health Globally.
</div>
```

---

## Implementation in Next.js

Add to `src/app/layout.tsx` for site-wide schemas:

```tsx
export default function RootLayout({ children }) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "MedicalOrganization"],
    // ... full schema above
  };
  
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Validation Tools
- **Google Rich Results Test:** search.google.com/test/rich-results
- **Schema.org Validator:** validator.schema.org
- **Google Search Console:** Rich Results report (after deployment)
