# FAQ Schema Library — Health Metro

> Ready-to-deploy FAQPage schemas. Copy, customize with real answers, and add to the relevant page.

---

## How to Implement in Next.js

```tsx
// components/FaqSchema.tsx
interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSchema({ questions }: { questions: FaqItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(q => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

## Schema Set 1: Medical Tourism General

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
        "text": "Medical tourism is the practice of traveling to another country to receive medical care, typically to access better quality treatment, lower costs, or faster access than available in one's home country. An estimated 14 million people travel internationally for healthcare each year."
      }
    },
    {
      "@type": "Question",
      "name": "What are the benefits of medical tourism?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The main benefits of medical tourism include: significantly lower treatment costs (typically 40–80% savings compared to Western countries), access to world-class specialists not available locally, shorter waiting times, the ability to combine treatment with recovery in a comfortable destination, and access to procedures not available or approved in your home country."
      }
    },
    {
      "@type": "Question",
      "name": "What are the risks of medical tourism?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Potential risks of medical tourism include: communication barriers with medical staff, difficulty managing complications after returning home, varying standards of care between facilities, risk of counterfeit medications, and challenges with follow-up care. These risks are significantly reduced by choosing internationally accredited hospitals through verified platforms like Health Metro."
      }
    },
    {
      "@type": "Question",
      "name": "Which countries are best for medical tourism?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The top countries for medical tourism are Thailand, India, Mexico, Turkey, and South Korea. Thailand is known for excellent hospitals and low costs; India leads in cardiology, orthopedics, and oncology; Mexico is popular for dental and cosmetic procedures; Turkey excels in hair transplants and cosmetic surgery; South Korea is renowned for cosmetic surgery and cancer treatment."
      }
    },
    {
      "@type": "Question",
      "name": "Is medical tourism safe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, medical tourism is safe when you choose hospitals with recognized international accreditations such as JCI (Joint Commission International) or NABH. Millions of patients travel for medical care annually with high success rates. Always verify hospital accreditation and surgeon credentials before booking through a platform like Health Metro."
      }
    }
  ]
}
```

---

## Schema Set 2: Costs & Insurance

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does medical tourism cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Medical tourism costs vary widely by procedure and destination. As a general guide: heart bypass surgery costs $7,900–$11,000 in India or Thailand vs $123,000 in the USA; hip replacement costs $7,000–$12,000 abroad vs $40,000 in the USA; dental implants cost $900–$1,200 abroad vs $3,000–$4,000 in the USA. Most patients save 40–80% on total treatment costs."
      }
    },
    {
      "@type": "Question",
      "name": "Does insurance cover medical tourism?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Coverage varies by plan. International health insurance policies (such as Cigna Global, AXA Health, and Allianz Care) typically cover treatment at accredited hospitals abroad. Standard domestic insurance rarely covers international treatment. Some US employers are now offering medical tourism as a cost-saving benefit. Always verify coverage with your insurer before traveling."
      }
    },
    {
      "@type": "Question",
      "name": "How much can I save with medical tourism?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most patients save between 40% and 80% on medical costs through medical tourism, even after including travel and accommodation expenses. For example, a $40,000 hip replacement in the USA might cost $7,000 in India — a saving of $33,000. Dental procedures typically offer 60–80% savings."
      }
    }
  ]
}
```

---

## Schema Set 3: Process & Logistics

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I find a hospital in another country?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To find a hospital abroad: 1) Use Health Metro's directory to search by country, specialty, and accreditation. 2) Filter for JCI or equivalent certified facilities. 3) Compare treatment costs, doctor credentials, and patient reviews. 4) Request a treatment quote directly through the platform. 5) Speak with the hospital's international patient coordinator before booking."
      }
    },
    {
      "@type": "Question",
      "name": "How do I transfer my medical records internationally?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To transfer medical records internationally: Request records from your current doctor in PDF or DICOM format (for imaging). Have records translated if needed (many top international hospitals have translation services). Send records securely via the hospital's patient portal or encrypted email. Health Metro's platform provides a secure way to share records with international providers."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need a medical visa to travel for healthcare?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Many countries offer specific medical visas for healthcare travelers. India's e-Medical Visa, for example, is easily obtainable online. Thailand, Turkey, and most other medical tourism destinations allow healthcare under standard tourist visas for most nationalities. Always check the requirements for your specific nationality and destination country."
      }
    }
  ]
}
```

---

## Schema Set 4: About Health Metro

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Health Metro?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Health Metro is a global digital platform connecting patients with accredited international healthcare providers worldwide. With the tagline 'Connecting Health Globally,' Health Metro enables patients to search, compare, and access medical services across borders, making quality healthcare more accessible regardless of geography."
      }
    },
    {
      "@type": "Question",
      "name": "How does Health Metro work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Health Metro works in four steps: 1) Search — find hospitals by country, medical specialty, and accreditation. 2) Compare — review costs, ratings, and specialist credentials. 3) Connect — submit your medical history and request a consultation. 4) Receive a personalized treatment plan and cost estimate from the hospital's international patient coordinator."
      }
    },
    {
      "@type": "Question",
      "name": "Is Health Metro free to use for patients?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Health Metro is free for patients to use. You can search our global directory, compare hospitals, and connect with international providers at no cost. Health Metro partners with healthcare providers who list on the platform."
      }
    },
    {
      "@type": "Question",
      "name": "How can hospitals join Health Metro?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Healthcare providers can apply to list on Health Metro at healthmetro.com/providers. We partner with internationally accredited hospitals, clinics, and specialist centers. Our team reviews each application to ensure quality and accreditation standards are met before listing."
      }
    }
  ]
}
```

---

## Validation

After adding any schema, validate at:
- **Google Rich Results Test:** https://search.google.com/test/rich-results
- **Schema.org Validator:** https://validator.schema.org
