# Product Definition

## Purpose
Define shared product intent so planning, architecture, and delivery stay aligned.

---

## Product Vision
Become the go-to tool for Israeli real estate investors to evaluate, compare, and confidently decide on investment properties — replacing spreadsheets and gut-feel with clear, data-driven yield analysis.

---

## Target Users

**Primary users — individual real estate investors:**
- First-time investors considering their first rental property and unsure how to evaluate whether a deal makes financial sense.
- Experienced investors managing or growing a portfolio who want to compare multiple properties quickly and consistently.
- What they are trying to accomplish: calculate net/gross yield, monthly cash flow, and mortgage repayment; compare properties side-by-side; understand the maximum property price they can afford given their financing capacity.

**Secondary users — real estate professionals:**
- Mortgage advisors and real estate agents who use the tool to assist clients during property evaluation.
- Core need: a credible, shareable analysis that supports the advice they give.

---

## Problem Statement
Israeli real estate investors — from first-timers to seasoned buyers — lack a simple, unified tool to evaluate whether a specific property is worth buying. They currently rely on scattered spreadsheets, back-of-envelope calculations, or fragmented online calculators that omit key variables such as mortgage structure, ongoing expenses, and future yield projections. This forces them to make high-stakes decisions without a clear, complete financial picture, increasing the risk of poor investments or missed opportunities.

---

## Value Proposition
Dira LeAshkaa gives investors a fast, accurate, and complete yield analysis for any Israeli residential property — covering purchase price, equity, mortgage terms, rental income, and ongoing costs — in one place. Unlike generic calculators, it also computes the user's personal maximum affordable property price, supports side-by-side comparison of multiple properties, and projects future yield scenarios, so users arrive at every viewing already knowing their numbers.

**Key differentiators:**
- All-in-one: mortgage + yield + cash flow + affordability ceiling in a single flow.
- Multi-property comparison to find the best-performing deal.
- Future yield simulation based on interest rate and time variables.
- Built specifically for the Israeli market (ILS, local mortgage conventions).

---

## Product Scope

**In scope:**
- Property data entry: address/city, purchase price, equity, financing percentage, interest rate, loan term, monthly rent, and recurring expenses.
- Calculated outputs: monthly cash flow, mortgage repayment, gross yield, net yield, and future yield estimate.
- Maximum affordable property price based on user financing capacity and disposable income.
- Multi-property comparison with a ranked winner.
- User accounts: save and revisit property calculations.
- Web app (current) and Android app (existing).

**Out of scope:**
- Real-time market data or property listings integration (e.g., Yad2, Madlan).
- Tax calculation (purchase tax, rental income tax tracks, capital gains).
- Properties outside Israel.
- Collaboration or sharing features (multi-user workspaces, shared reports).
- iOS app (not yet published).
- Mortgage broker or agent referral marketplace.

---

## Success Metrics

**Business metrics:**
- Registered users (target: define baseline after first 3 months of web launch).
- Monthly active users (MAU) — retention signal.
- Android installs and active users (current baseline: 50+).

**Product metrics:**
- Calculation completion rate: percentage of users who reach a yield result after starting a property entry (target: >70%).
- Properties saved per active user: indicates repeat engagement and comparison usage (target: >2 per session).
- Multi-property comparison usage rate: percentage of users who compare at least 2 properties.
- Return visit rate within 30 days.

*Baseline values to be defined after first 60 days of instrumented usage.*

---

## Constraints and Assumptions

**Constraints:**
- Israeli market only: currency, mortgage conventions, and regulatory context are IL-specific.
- Single developer project: prioritization must be strict; complexity must be managed.
- No real-time data feeds: all inputs are manual; no API integrations with property portals or banks.
- Web app is hosted on Render (free/low tier): availability and performance constraints apply.

**Assumptions to validate:**
- Users are willing to manually enter property details rather than import from a listing URL.
- The affordability ceiling calculation is a valued feature, not just a nice-to-have.
- Users make multi-property comparisons within a single session, not across days.
- Registration friction is acceptable given the value of saved properties.

---

## Prioritization Rules
- Prioritize features that directly improve yield calculation accuracy and comparison clarity.
- Prefer UX changes that reduce drop-off during property data entry.
- Defer aesthetic or marketing features unless required for launch readiness.
- Do not add scope (tax calculations, listing integrations) until core calculation flow is stable and validated.

---

## Update Triggers
Update this file when:
- Core user segments shift (e.g., expanding to professional investors or overseas buyers).
- Product scope changes materially (e.g., adding tax calculation or real-time data).
- Success metrics are revised after initial measurement periods.
- A new platform (iOS, desktop) is added to scope.