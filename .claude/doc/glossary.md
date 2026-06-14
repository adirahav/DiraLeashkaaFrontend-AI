# Glossary

## Purpose
Define canonical domain terms and approved short forms used across code, API routes, docs, and plans.

---

## Core Terms

### `property`
- **Canonical meaning:** A single residential real estate asset entered by the user for yield evaluation.
- **Use:** Always `property`, not `apartment`, `asset`, `unit`, or `dira`.
- **Plural:** `properties`.

### `yield`
- **Canonical meaning:** The calculated return on a property investment, expressed as an annual percentage.
- **Variants:**
  - `grossYield` — yield before deducting ongoing expenses.
  - `netYield` — yield after deducting ongoing expenses.
  - `futureYield` — projected yield based on interest rate and time simulation.
- **Use:** Always `yield` (and its variants), not `roi`, `return`, `tsuah`, or `profitability`.

### `mortgage`
- **Canonical meaning:** The loan taken to finance a property purchase, defined by interest rate, term, and monthly repayment.
- **Use:** Always `mortgage`, not `loan`, `credit`, or `mashkanta`.

### `equity`
- **Canonical meaning:** The buyer's own capital contributed to the purchase (as opposed to the financed portion).
- **Use:** Always `equity`, not `ownCapital`, `selfCapital`, `downPayment`, or `hon`.

### `monthlyFlow`
- **Canonical meaning:** Net monthly cash flow from a property — rental income minus mortgage repayment and ongoing expenses.
- **Use:** Always `monthlyFlow`, not `cashFlow`, `monthlyCash`, or `netIncome`.

### `expenses`
- **Canonical meaning:** Recurring costs associated with owning and renting out a property (e.g., maintenance, insurance, management fees, vacancy allowance).
- **Use:** Always `expenses`, not `costs`, `fees`, or `hוצאות`.

### `affordability`
- **Canonical meaning:** The maximum property price a user can purchase given their equity, financing capacity, and disposable income.
- **Use:** Always `affordability`, not `budget`, `ceiling`, or `maxPrice`.

### `comparison`
- **Canonical meaning:** A side-by-side evaluation of two or more saved properties to identify the best-yielding option.
- **Use:** Always `comparison`, not `ranking`, `analysis`, or `versus`.

---

## Naming Alignment
- Keep this glossary aligned with naming decisions in `../rules/naming-rules.md` once that file exists.
- If a new domain term is introduced, add it here before broad usage.

---

## Update Rules
- Add new terms when introducing a new bounded context, entity, or shared API concept.
- Avoid synonyms for existing terms unless explicitly approved and documented here.
- When a term is renamed in code, update this file in the same commit.
