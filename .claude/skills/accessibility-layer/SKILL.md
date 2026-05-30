---
name: accessibility-layer
description: Use this skill to ensure all UI/UX implementations meet global A11y (Accessibility) standards. Enforces WCAG 2.1 Level AA compliance, semantic HTML architecture, and inclusive design principles to support screen readers, keyboard navigation, and visual impairments.
allowed_tools: [read_file]
references:
  - @css-layer/SKILL.md
examples:                                           
   - input: "Create a functional icon button for closing a modal"         
     output: "<button onClick={onClose} className={cn('p-2 hover:bg-slate-100 rounded-full transition-colors')} aria-label={getPhrase('acc_close_modal', 'Close modal')} title={getPhrase('acc_close_modal', 'Close modal')}><X size={20} aria-hidden='true' /></button>"
---

# Accessibility & Inclusive Design Layer (A11y)
*Objective:* Build digital experiences that are perceivable, operable, understandable, and robust for all users. This layer ensures the application is not just "compliant" but truly inclusive by design.

**Key Focus Areas:**
- *WCAG 2.1 Level AA:* Strict adherence to color contrast (4.5:1), text scaling, and focus indicators.

- *Semantic HTML:* Using the right tags for the right job (e.g., `<main>`, `<nav>`, `<h1>`-`<h6>`).

- *Keyboard Orchestration:* Full operability via `Tab`, `Enter`, and `Space`.

- *Screen Reader Support:* Meaningful `aria-*` attributes and hidden structural labels.

## Core Principles

### 1. Semantic Architecture
- *Tag Integrity:* Never use a `<div>` or `<span>` for interactive elements. Use `<button>` for actions and <a> for navigation.

- *Landmarks:** Every page must contain a single `<main>` element. Headers and Footers must use `<header>` and `<footer>` tags.

- *Heading Hierarchy:* Use headings in sequential order. Never skip levels (e.g., `h1` directly to `h3`) for visual styling. Use Tailwind classes for font size, not tags.

### 2. Interaction & Keyboard Logic
- *Focus States:* Never suppress the default focus ring without providing a custom, high-visibility alternative (e.g., `focus-visible:ring-2 focus-visible:ring-offset-2`).

- *Skip Links:* Implement a "Skip to Content" link for keyboard users to bypass navigation.

- *Modals & Dialogs:* Must implement focus trapping (focus stays inside the modal) and close on `Esc` key. Use `role="dialog"` and `aria-modal="true"`.

### 3.Visual & Cognitive Inclusion
- *Contrast Ratios:* Text-to-background contrast must meet a minimum of 4.5:1. Use tools to verify color combinations.

- *No Color-Only Cues:* Information must not be conveyed by color alone (e.g., an error should have an icon or text, not just red color).

- *Text Scaling:* Ensure layout remains functional when font size is increased by 200% via the Accessibility Menu or browser settings.

### 4. ARIA & Screen Reader Mastery
- *Aria-Labels:* Every icon-only button must have an `aria-label` provided via `getPhrase`.

- *Aria-Hidden:* Decorative icons and images that do not add information must have `aria-hidden="true"` to reduce screen reader noise.

- *Live Regions:* Use `aria-live="polite"` for dynamic content updates (like "Calculating..." or Toast notifications) so screen readers announce changes.

### 5. Hebrew RTL Accessibility
- *Directional Clarity:* Ensure the reading order for screen readers follows the RTL (Right-to-Left) flow.

- *Logical Mapping:* Focus order must follow the visual RTL flow (Right to Left, then Top to Bottom).


## Implementation Checklist
- [ ] Element uses semantic tag (`<button>`, `<section>`, etc.).

- [ ] Interactive elements have a visible focus state.

- [ ] Color contrast is verified for all background/foreground pairs.

- [ ] All icon-only actions have descriptive `aria-label` strings.

- [ ] Logical `Tab` order is maintained.
