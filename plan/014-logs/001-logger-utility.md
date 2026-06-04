# Plan: Debug Logger System - Implementation

## Task Overview
Implement a global, in-app debug logging system with a floating viewer panel.
The system intercepts tagged `console.log` calls across the entire codebase,
stores them in memory, and exposes them through a developer overlay triggered
by 7 taps on the app logo.

---

## Step 1: The Logger Utility (`src/utils/logger.ts`)

**Core Responsibilities:**
- Override the native `console.log` to intercept tagged messages.
- Parse the tag from the log format: `[TAG] message`.
- Store log entries in a capped in-memory array (e.g., max 500 entries).
- Expose a subscribe mechanism so the UI panel can react to new entries.

**Log Entry Shape:**
```ts
interface LogEntry {
  id: string;          // crypto.randomUUID()
  tag: string;         // e.g. "LOGIN"
  message: string;     // e.g. "Call API GET '/auth/login'"
  timestamp: string;   // HH:MM:SS
  raw: string;         // full original string
  page: string;        // window.location.pathname at time of log
}
```

**API surface:**
- `logger.getLogs(): LogEntry[]`
- `logger.clear(): void`
- `logger.subscribe(cb): unsubscribe`
- `logger.getAvailableTags(): string[]`

**Initialization:** Call once at the top of `main.tsx` before anything else.

---

## Step 2: Tagging Convention (Applied Across the Codebase)

Format: `console.log("[TAG] description")`

**Tag reference table (LLM must apply these):**

| Area                  | Tag               |
|-----------------------|-------------------|
| Authentication        | `LOGIN`           |
| Registration          | `SIGNUP`          |
| Password reset        | `FORGOT-PASSWORD` |
| Version check         | `VERSION`         |
| Splash / boot         | `SPLASH`          |
| Property data         | `PROPERTY`        |
| API calls (generic)   | `API`             |
| Navigation            | `NAV`             |
| Store / Zustand       | `STORE`           |
| Errors                | `ERROR`           |

**Every API call must log two lines:**
```ts
console.log("[TAG] Call API METHOD 'endpoint'")
console.log("[TAG] API METHOD 'endpoint' response: ", data)
```

---

## Step 3: The Log Viewer Component (`src/components/debug/LogViewer.tsx`)

### Trigger
- A hidden tap counter on the app logo (wherever it is rendered).
- 7 taps within 3 seconds → open the panel.
- Counter resets after 3 seconds of inactivity.

### Log Entry Row
- Tag badge with color per tag (consistent color mapping).
- Timestamp (`HH:MM:SS`).
- Message text, monospace font.
- Page path in muted text beneath the message (e.g. `/calculator`).
- Subtle divider between entries.

### Panel Layout (RTL, full-screen modal overlay)


## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow the "STOP-AND-ASK" gate before generating any code.
1. Write at least 3+ clarifying questions. 

CRITICAL INSTRUCTION: After presenting your questions, you must STOP and wait for my explicit approval and answers. Do not proceed to code generation or the 'Flow Implementation' phase. Do not assume any defaults or start the implementation until I give you the green light.

## AI Agent Pre-Flight Validation & Discussion Log
**Strict Instruction:** All discussions, clarifying questions, and logic validations must be written directly into the Discussion Log section of this file. Do not provide answers or questions in the chat interface alone.

**Format for Discussion:**
- Each entry must start with a timestamped header.
- Maintain a running log of our decisions.

---
# Discussion Log:

---
*AI says [2026-06-03]:*

Before generating any code, I scanned the codebase to ask informed questions.
**Findings:** `src/main.tsx` exists and is clean. The logo renders in `src/components/common/Header.tsx:115`
via `<Logo size={48} showText={true} />`. The `Logo` component lives in `src/components/common/Logo.tsx`
and is SVG + Framer Motion — no tap handler today. There are currently **zero** `console.log` calls
in `src/`. Step 2's tagging convention would be adding new logs, not retrofitting existing ones.

---

### Q1 — Scope of Step 2 (Tagging)
The codebase currently has **no** `console.log` calls at all.
Step 2 says "Applied Across the Codebase" and the tag table lists 10 areas.
Should this task **add new logs** throughout existing services/hooks/pages,
or is Step 2 a convention document only — to be applied later call-by-call?

> If we should add them now: which files/areas are in scope for this PR?
> (e.g., only `services/`, or also store slices, pages, hooks?)

> *Your answer:* Add all logs now, across the entire codebase. All files in scope — services/, store/ slices, hooks/, pages/, components/ — anywhere an API call, navigation event, auth flow, or state change occurs.

---

### Q2 — Multi-argument `console.log` serialization
The plan shows this pattern:
```ts
console.log("[TAG] API GET '/auth/login' response: ", data)
```
That is two arguments — a string and an object.
How should the logger serialize the extra arguments into the `LogEntry`?

Options:
- a) `JSON.stringify(data)` appended to `message`
- b) Store `args: unknown[]` as an extra field on `LogEntry`
- c) `String(data)` / `.toString()`

Which do you prefer, or should the LogEntry shape be extended?

> *Your answer:* (a) JSON.stringify(data) appended to message.
The panel's purpose is producing plain text for pasting into WhatsApp — JSON.stringify gives a readable, complete, single-line result. Option (b) overcomplicates the UI unnecessarily, and (c) would produce [object Object] which is useless.

---

### Q3 — Logo tap trigger location
The logo is used in `Header.tsx` as `<Logo size={48} showText={true} />`.
The 7-tap trigger could live in one of two places:

- **a) Inside `Logo.tsx` itself** — the component becomes tap-aware; any usage gets the trigger for free.
- **b) In `Header.tsx` wrapping the `<Logo>`** — the component stays pure; only the header instance is tap-aware.

Which approach do you want? (Option a is cleaner long-term; option b keeps `Logo` dumb.)

> *Your answer:* (b) In Header.tsx — keep Logo dumb.
Logo is a pure presentational component and should stay that way. Debug tooling doesn't belong inside a UI primitive.

---

### Q4 — Production build behavior
Should the logger and the viewer panel be:

- **a) Always active** (production too — useful for field debugging)
- **b) Dev-only** (stripped via `import.meta.env.DEV` / tree-shaken in prod builds)
- **c) Feature-flagged** (always shipped but toggled by a runtime env var or localStorage key)

> *Your answer:* (a) Always active — logger and viewer ship in production too.
Field debugging via the 7-tap trigger is the whole point. Real users on real devices are exactly where you need it most.

---

### Q5 — Log persistence across page refresh
The plan says "in-memory array (max 500 entries)."
Should logs survive a **page refresh** (e.g., via `sessionStorage` or `localStorage`),
or is pure in-memory fine and logs are intentionally lost on reload?

> *Your answer:* **Pure in-memory only.** Logs are intentionally lost on reload. No `sessionStorage`, no `localStorage`.

---

### Q6 — `console.log` override: tagged-only or all logs?
The plan says "intercept **tagged** messages" (`[TAG] …` format).
What happens to untagged `console.log` calls (from third-party libs, React internals, etc.)?

- **a) Pass them through silently** (don't store, but still print to the real console)
- **b) Store them under a catch-all `OTHER` tag**
- **c) Suppress them entirely**

> *Your answer:* (a) Pass them through silently — untagged logs print to the real console but are not stored in the viewer.
Third-party noise has no place in the panel. Only tagged logs are relevant to your debugging.

---

**STOPPED. Waiting for answers before writing any code.**

---
*AI says [2026-06-03] — Decisions locked, proceeding to implementation:*

| # | Decision |
|---|----------|
| Q1 | Add tagged logs NOW across all of: services/, store/ slices, hooks/, pages/, components/ |
| Q2 | Extra args → `JSON.stringify()` appended to `message` in the `LogEntry` |
| Q3 | Tap trigger lives in `Header.tsx` — `Logo` stays a dumb presentational component |
| Q4 | Logger and viewer always active (production included) |
| Q5 | Pure in-memory only — logs lost on reload |
| Q6 | Untagged logs pass through to real console silently, not stored |

Implementation order: logger utility → main.tsx init → tag logs across codebase → Header tap trigger → LogViewer component.