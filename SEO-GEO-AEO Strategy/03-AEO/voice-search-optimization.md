# Voice Search Optimization — Health Metro

> Voice search accounts for 27% of all mobile searches and is the primary interface for AI assistants. Health queries are one of the top voice search categories.

---

## The Voice Search Mindset

**Text search:** `best hospital thailand`
**Voice search:** *"Hey Google, what is the best hospital in Thailand for knee replacement surgery?"*

Voice queries are:
- **Full questions** (not fragments)
- **Conversational** (as you'd ask a person)
- **Specific** (include more context)
- **Locally-oriented** (often include location)
- **Action-oriented** (seeking immediate answers)

The answer given by voice assistants is almost always the **featured snippet** or **Position Zero result.** AEO and voice optimization are deeply intertwined.

---

## Voice Query Patterns for Health Metro

### Pattern 1: Discovery Queries
*"What is the best [X] for [condition]?"*

Examples:
- "What is the best hospital in India for heart surgery?"
- "What is the best country for affordable dental work?"
- "What is the best platform to find international hospitals?"

**How to target:** Comparison pages with definitive recommendations. Start with "The best [X] for [Y] is..." structure.

### Pattern 2: Process Queries
*"How do I [action]?"*

Examples:
- "How do I find a doctor abroad?"
- "How do I transfer medical records internationally?"
- "How do I get a medical visa for India?"

**How to target:** Step-by-step How-To guides. HowTo schema mandatory.

### Pattern 3: Cost Queries
*"How much does [X] cost?"*

Examples:
- "How much does knee replacement surgery cost in Thailand?"
- "How much can I save getting dental work done in Mexico?"
- "How much does IVF cost in India?"

**How to target:** Pages with specific price ranges in the first paragraph.

### Pattern 4: Safety/Trust Queries
*"Is it safe to [action]?"*

Examples:
- "Is it safe to get surgery in Thailand?"
- "Are hospitals in India safe for foreigners?"
- "Is medical tourism a good idea?"

**How to target:** Trust pages with direct "Yes/No + context" answers.

### Pattern 5: Local/Near Queries
*"Find [X] near me"*

Examples:
- "Find international healthcare providers near me"
- "Find hospitals that accept international patients near me"

**How to target:** Location-based landing pages. Local schema markup.

---

## Voice Search Content Rules

### Rule 1: Conversational Tone
Write as you would speak. Read every answer aloud — if it sounds unnatural, rewrite it.

❌ "The utilization of internationally accredited medical facilities..."
✅ "When you choose an internationally accredited hospital..."

### Rule 2: Short, Speakable Answers
Voice assistants read aloud — answers must flow naturally in 10–30 seconds:
- ~125 words per minute spoken speed
- Ideal voice answer: **40–70 words** (15–30 seconds)

### Rule 3: Direct Answers to Direct Questions
Voice queries expect direct answers — no preamble:

❌ "Great question! There are many factors to consider when..."
✅ "The best country for affordable heart surgery is India, where costs are typically 80% lower than in the US."

### Rule 4: No Ambiguity
Voice answers must stand alone — the user can't see context:

❌ "It depends on several factors listed in the table above."
✅ "Costs typically range from $3,000 to $15,000 depending on the procedure and country."

---

## SpeakableSpecification Implementation

Mark key answer passages for voice:

### In Next.js Layout
```tsx
// Add to blog post template
<article>
  <h1>{title}</h1>
  
  {/* Speakable summary — first section only */}
  <div className="speakable-summary" data-speakable>
    {summary}
  </div>
  
  {/* Key facts box — speakable */}
  <div className="key-facts" data-speakable>
    <h2>Key Facts</h2>
    {keyFacts.map(fact => <p key={fact}>{fact}</p>)}
  </div>
  
  {/* Rest of content */}
  {children}
</article>
```

### Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".speakable-summary", ".key-facts", "h1"]
  }
}
```

---

## Local Voice Search Strategy

For queries like "find international healthcare near me":

### Google Business Profile Optimization
- Category: "Health Technology Company" + "Medical Referral Service"
- Description: Include voice-search phrases naturally
- Q&A section: Pre-populate with common voice queries and answers
- Posts: Update weekly with fresh health content

### Local Intent Pages
Create city/country landing pages optimized for voice:
```
healthmetro.com/find/india
healthmetro.com/find/thailand
healthmetro.com/find/dubai
```

Each page should have a speakable summary answering:
*"How do I find healthcare in [country]?"*

---

## Voice Search KPIs

| KPI | How to Measure | Target |
|---|---|---|
| Question queries in GSC | Search Console → Queries → filter "?" | +100% MoM |
| Featured snippet ownership | Ahrefs SERP features | 20+ by Month 6 |
| Voice-friendly page count | Pages with SpeakableSchema | 30+ by Month 3 |
| Avg. query length | GSC → Queries → character count analysis | Trending toward 6+ words |
