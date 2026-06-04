# AEO Master Strategy — Answer Engine Optimization
## Health Metro

> **AEO is the discipline of making your content the direct answer** that appears in Google's featured snippets (Position Zero), voice search responses, People Also Ask boxes, and AI-generated direct answers.

---

## What is AEO?

Answer Engine Optimization is the practice of structuring content so that it is the single best, most direct answer to a specific question. When done correctly, your content appears *above* standard search results as a featured snippet, inside voice assistant responses, or in Google's AI Overviews.

**Why it matters for Health Metro:**
- Healthcare is one of the top verticals for voice search ("Hey Google, how do I find a hospital in Thailand?")
- Medical/health queries generate a high density of featured snippets and PAA boxes
- Position Zero = massive visibility without needing the #1 ranking

---

## The AEO Framework

### 1. Question Research — Find the Exact Questions Being Asked

**Tools:**
- **AnswerThePublic** — Visualize all question forms around a seed keyword
- **AlsoAsked.com** — Maps PAA relationships
- **Google Search Console** — Your existing question queries
- **BrightLocal / SEMrush PAA feature**
- **Manual Google search** — Type your keyword and read the PAA box

**Process:**
1. Seed: "medical tourism" → collect 50+ questions
2. Seed: "hospital abroad" → collect 30+ questions
3. Seed: "health insurance internationally" → collect 30+ questions
4. Categorize by: Definition / How-to / Comparison / Cost / Safety / Timing
5. Map each question to an existing or planned page

---

### 2. The Perfect Answer Format

Different question types need different answer structures:

| Question Type | Optimal Answer Format | Max Length |
|---|---|---|
| "What is X?" | 1–2 sentence definition | 40–60 words |
| "How does X work?" | Numbered steps | 3–8 steps |
| "How much does X cost?" | Price range + context | 50–80 words |
| "What is the best X?" | Intro sentence + bullet list | 40–60 words intro |
| "Is X safe/legal?" | Direct yes/no + explanation | 40–80 words |
| "Why does X happen?" | Cause + explanation | 40–60 words |
| "When should I X?" | Condition + recommendation | 40–60 words |

---

### 3. Page Structure for AEO

```html
<!-- H2 must be the exact question from search -->
<h2>What Is Medical Tourism?</h2>

<!-- IMMEDIATE answer — do not bury the answer after context -->
<p class="speakable-summary">
  Medical tourism is the practice of traveling to another country to 
  receive medical care, typically to access better quality treatment, 
  lower costs, or shorter waiting times than available in one's home country.
</p>

<!-- Then expand with context, stats, examples -->
<p>
  The global medical tourism market is valued at $54 billion (2024)...
</p>
```

**Critical rule:** The answer **must be in the first paragraph immediately after the H2.** Google extracts the first eligible `<p>` under the matching heading.

---

### 4. The BLUF Principle (Bottom Line Up Front)

Every answer on Health Metro must lead with the most important information:

❌ **Wrong (Answer buried):**
> "When considering whether to travel abroad for medical treatment, there are many factors to consider. The quality of hospitals varies significantly. You should also think about the cost. In general, medical tourism can save you significant money. The answer is yes, it can be safe."

✅ **Right (BLUF):**
> "Yes, medical tourism is safe when you choose JCI-accredited hospitals through a verified platform. Over 50 countries offer internationally accredited healthcare, with costs typically 40–80% lower than Western countries."

---

## People Also Ask (PAA) Domination Strategy

### Target 50 PAA Questions in Month 1–3

**Priority Question Clusters:**

**Medical Tourism — What/Why:**
- What is medical tourism?
- Why do people travel for medical treatment?
- What are the benefits of medical tourism?
- What are the risks of medical tourism?
- What countries are best for medical tourism?

**Medical Tourism — Cost:**
- How much does medical tourism cost?
- Is medical treatment cheaper abroad?
- Can I save money getting surgery abroad?
- How much can I save on surgery in India?
- Does insurance cover medical tourism?

**Global Healthcare — How:**
- How do I find a hospital in another country?
- How do I book medical care abroad?
- How does international healthcare work?
- How do I get a medical visa?
- How do I transport my medical records internationally?

**Safety & Quality:**
- Is it safe to get surgery in Thailand?
- What is JCI accreditation?
- How do I know if a hospital is accredited?
- Are doctors in India qualified?
- What should I do if something goes wrong abroad?

**Health Metro Specific:**
- What is Health Metro?
- How does Health Metro work?
- Is Health Metro free to use?
- How do hospitals join Health Metro?

---

## Voice Search Optimization

### How Voice Search Differs from Text Search

| Text Search | Voice Search |
|---|---|
| "medical tourism Thailand cost" | "How much does surgery cost in Thailand?" |
| "best hospitals India" | "What are the best hospitals in India for international patients?" |
| "dental tourism cheap" | "Where is the cheapest place to get dental work done abroad?" |
| Short, fragmented | Full natural language questions |
| Any length answers | Conversational, under 30 seconds when spoken |

### Voice Search Rules

1. **Target conversational long-tail queries** — full natural language questions
2. **Answers must be speakable** — read aloud in 10–30 seconds
3. **Local intent matters** — "near me" queries + city/country specifics
4. **Deploy SpeakableSpecification schema** on key answer pages

### Voice Search Query Types to Target

| Query Pattern | Example | Content Type |
|---|---|---|
| "What is [X]?" | "What is medical tourism?" | Definition page |
| "How do I [action]?" | "How do I find a hospital abroad?" | How-to guide |
| "Is [X] safe?" | "Is surgery abroad safe?" | Trust/safety page |
| "How much does [X] cost?" | "How much does a knee replacement cost in India?" | Cost guide |
| "What is the best [X] for [Y]?" | "What is the best hospital in Thailand for heart surgery?" | Directory |

---

## AEO Quick Wins — Implement This Week

### 1. Add a "Key Takeaways" box to every article
```html
<div class="key-takeaways">
  <h3>Key Takeaways</h3>
  <ul>
    <li>Medical tourism saves patients 40–80% on healthcare costs</li>
    <li>Over 50 countries offer internationally accredited hospitals</li>
    <li>Health Metro connects patients with verified global providers</li>
  </ul>
</div>
```

### 2. Create a standalone "Quick Answer" section
For every piece, include a boxed summary:
```html
<div class="quick-answer">
  <strong>Quick Answer:</strong>
  [40–60 word direct answer to the article's main question]
</div>
```

### 3. Format FAQ sections with exact question H3s
Every H3 must be the exact question as typed in Google. Check PAA boxes.

---

## AEO Performance Targets

| Metric | Tool | Month 3 Target | Month 6 Target |
|---|---|---|---|
| Featured Snippets Owned | Ahrefs / GSC | 5 | 20 |
| PAA Appearances | SEMrush | 15 | 50 |
| Voice Search Queries | GSC (question queries) | +50% | +150% |
| AI Overview Appearances | Manual testing | 3 queries | 15 queries |

See also: [`featured-snippet-guide.md`](./featured-snippet-guide.md) and [`paa-strategy.md`](./paa-strategy.md)
