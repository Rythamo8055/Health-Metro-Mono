# KPI Dashboard Specification — SEO · GEO · AEO
## Health Metro

> Master performance tracking spec. Build this as a live dashboard in Looker Studio (free) connected to Google Analytics 4 + Google Search Console.

---

## Dashboard Architecture

```
Health Metro — Search Visibility Dashboard
├── Section 1: Executive Summary (Top-line KPIs)
├── Section 2: SEO Performance
├── Section 3: GEO (AI Visibility) Tracking
├── Section 4: AEO Performance
└── Section 5: Content Performance
```

---

## Section 1: Executive Summary KPIs

| KPI | Target M3 | Target M6 | Target M12 | Data Source |
|---|---|---|---|---|
| Total Organic Sessions | +50% | +150% | +400% | GA4 |
| Organic Revenue / Leads | +30% | +100% | +300% | GA4 |
| Domain Rating (DR) | 20 | 35 | 50 | Ahrefs |
| Total Keywords Ranking | 100 | 300 | 1,000 | Ahrefs / GSC |
| AI Visibility Score (manual) | 2/10 | 5/10 | 8/10 | Manual Testing |

---

## Section 2: SEO Performance KPIs

### Traffic & Rankings

| Metric | Tool | Update Frequency | M12 Target |
|---|---|---|---|
| Organic sessions | GA4 | Weekly | 50,000+ / month |
| Organic new users | GA4 | Weekly | 40,000+ / month |
| Top 10 keyword rankings | Ahrefs | Weekly | 100+ keywords |
| Top 3 keyword rankings | Ahrefs | Weekly | 30+ keywords |
| Average position (GSC) | Search Console | Weekly | < 20 |
| Click-through rate (GSC) | Search Console | Weekly | > 5% |
| Organic impressions | Search Console | Weekly | 1M+ / month |

### Technical Health

| Metric | Tool | Frequency | Target |
|---|---|---|---|
| Core Web Vitals — LCP | PageSpeed | Monthly | < 2.5s |
| Core Web Vitals — INP | CrUX | Monthly | < 200ms |
| Core Web Vitals — CLS | PageSpeed | Monthly | < 0.1 |
| Crawl errors | GSC / Ahrefs | Monthly | 0 |
| Broken internal links | Screaming Frog | Monthly | 0 |
| Pages indexed | GSC | Monthly | All public pages |

### Authority

| Metric | Tool | Frequency | Target |
|---|---|---|---|
| Domain Rating | Ahrefs | Monthly | 35+ (M6) |
| Referring domains | Ahrefs | Monthly | 50+ new (M6) |
| New backlinks | Ahrefs | Weekly | 20+ / month |
| Lost backlinks | Ahrefs | Weekly | < 5 / month |

---

## Section 3: GEO (AI Visibility) Tracking

> This section uses manual testing — no automated tool covers all AI platforms yet.

### Monthly AI Query Test Protocol

Run these exact queries in each AI platform. Score 1 if Health Metro is mentioned, 2 if cited with URL.

| Query | ChatGPT | Gemini | Perplexity | Copilot | Claude |
|---|---|---|---|---|---|
| What is Health Metro? | / | / | / | / | / |
| Best medical tourism platforms | / | / | / | / | / |
| How do I find a hospital in another country? | / | / | / | / | / |
| What is global healthcare connectivity? | / | / | / | / | / |
| Medical tourism platforms list | / | / | / | / | / |

**Scoring:** 0 = Not mentioned / 1 = Mentioned without link / 2 = Cited with URL
**Max score:** 50 (10 queries × 5 platforms × 1)

**Target:**
- Month 1: 0 (baseline)
- Month 3: 5+
- Month 6: 15+
- Month 12: 35+

### Entity Tracking

| Platform | Health Metro Entity Found? | Description Used | Update |
|---|---|---|---|
| Google Knowledge Panel | Yes / No | [Text] | Monthly |
| Wikidata | Yes / No | [URL] | Monthly |
| Bing Entity | Yes / No | [Text] | Monthly |
| LinkedIn | Yes / No | [Followers] | Monthly |
| Crunchbase | Yes / No | [Profile URL] | Monthly |

---

## Section 4: AEO Performance KPIs

### Featured Snippets

| Metric | Tool | Frequency | Target |
|---|---|---|---|
| Featured snippets owned | Ahrefs / SEMrush | Monthly | 5 (M3) / 20 (M6) |
| New snippets gained | Ahrefs | Monthly | +3 / month |
| Snippets lost | Ahrefs | Monthly | < 1 / month |

### People Also Ask

| Metric | Tool | Frequency | Target |
|---|---|---|---|
| PAA appearances | SEMrush | Monthly | 20 (M3) / 50 (M6) |
| New PAA wins | SEMrush | Monthly | +5 / month |

### Voice Search Signals

| Metric | Tool | Frequency | Target |
|---|---|---|---|
| Question queries (contain "?") | GSC Queries | Monthly | +50% MoM |
| Long-tail queries (6+ words) | GSC | Monthly | +40% MoM |
| Pages with SpeakableSchema | GSC Rich Results | Monthly | 30+ |
| Pages with FAQPage schema | GSC Rich Results | Monthly | 15+ |

---

## Section 5: Content Performance

| Metric | Tool | Frequency | Target |
|---|---|---|---|
| Top 10 pages by organic sessions | GA4 | Monthly | Track trends |
| Pages with 0 organic clicks | GSC | Monthly | Declining trend |
| Avg. time on page | GA4 | Monthly | > 3 minutes |
| Bounce rate (organic) | GA4 | Monthly | < 60% |
| Content published | Internal | Monthly | 8+ / month |
| Content updated | Internal | Monthly | 4+ / month |

---

## Reporting Template

See: [`reporting-template.md`](./reporting-template.md)

---

## Dashboard Tools Recommended

| Tool | Cost | Used For |
|---|---|---|
| Google Search Console | Free | SEO impressions, clicks, rankings |
| Google Analytics 4 | Free | Traffic, conversions, behavior |
| Ahrefs | $99/mo | Rankings, backlinks, competitor analysis |
| SEMrush | $119/mo | PAA tracking, featured snippets |
| Looker Studio | Free | Dashboard visualization |
| PageSpeed Insights | Free | Core Web Vitals |
| AlsoAsked.com | $19/mo | PAA discovery |
| Perplexity / ChatGPT | $20/mo | GEO manual testing |
