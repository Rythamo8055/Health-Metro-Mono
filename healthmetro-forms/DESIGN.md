---
name: Health Metro Forms
description: High-fidelity medical onboarding system
colors:
  primary: "#027473"
  secondary: "#d97234"
  neutral-bg: "#ffffff"
  neutral-fg: "#1A2020"
  accent-blue: "#0051C3"
  muted: "#F8FAFA"
  border: "#E5E7EB"
typography:
  display:
    fontFamily: "var(--font-geist-sans), Inter, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "var(--font-geist-sans), Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
spacing:
  sm: "0.5rem"
  md: "1rem"
  lg: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0.5rem 1.5rem"
  card-glass:
    backgroundColor: "rgba(255, 255, 255, 0.7)"
    rounded: "{rounded.lg}"
    padding: "2rem"
---

# Design System: Health Metro Forms

## 1. Overview

**Creative North Star: "The Clinical Sanctuary"**

The Health Metro visual system is designed to evoke absolute trust, professional efficiency, and modern medical excellence. It rejects the "SaaS-cream" look of generic startups in favor of a crisp, editorial medical aesthetic.

**Key Characteristics:**
- Deep Teal (#027473) for authority and calm.
- Generous white space for cognitive ease.
- Precise, high-contrast typography.
- Glassmorphism used sparingly for layered depth.

## 2. Colors

The palette is anchored by the deep medical teal, balanced by a vibrant orange for call-to-actions.

### Primary
- **Medical Teal** (#027473): The primary brand identifier. Used for major UI elements, headers, and active states.

### Secondary
- **Vitality Orange** (#d97234): Used exclusively for primary actions and highlights that require immediate attention.

### Neutral
- **Slate Ink** (#1A2020): Body text color. High legibility without the harshness of pure black.
- **Sterile White** (#ffffff): Background color for maximum clarity.

**The Rarity Rule.** The primary teal is used on ≤15% of the screen. Its presence should signal importance, not overwhelm the eye.

## 3. Typography

**Display Font:** Geist Sans (Modern, technical)
**Body Font:** Geist Sans

### Hierarchy
- **Display**: Used for page titles and hero headings. Bold, tight tracking.
- **Body**: Used for all form labels and paragraph text. 16px base for accessibility.

## 4. Elevation

The system uses **Tonal Layering** rather than traditional drop shadows. Depth is created through background tints and subtle glass blurs.

**The Glass Rule.** Glass cards are reserved for floating containers (modals, fixed-position forms) to maintain context without visual clutter.

## 5. Components

### Buttons
- **Shape:** Rounded (12px radius)
- **Primary:** Medical Teal background, white text.
- **Secondary:** Vitality Orange background for terminal actions (Submit).

### Cards
- **Style:** Glass finish (blur: 10px, opacity: 70%).
- **Padding:** 2rem internal padding for spaciousness.

## 6. Do's and Don'ts

### Do:
- **Do** use Medical Teal for step indicators.
- **Do** maintain a minimum of 40px padding between major sections.
- **Do** use Inter/Geist for all medical data display.

### Don't:
- **Don't** use border-left stripes on cards.
- **Don't** use gradient text for medical labels.
- **Don't** use harsh shadows (>20% opacity).
