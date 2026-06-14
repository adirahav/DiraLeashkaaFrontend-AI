---
name: tracker-system
description: Global user activity tracking system. Captures clicks, form field interactions, scroll depth, idle states, and navigation events automatically. Feeds the Admin analytics dashboard with structured tracker data. Designed for new-user funnel analysis with built-in DB size protection.
references:
  - @page-layer/SKILL.md
  - @state-management-layer/SKILL.md
  - @api-layer/SKILL.md
  - @tracker-api.yaml
  - @ui-component-layer/SKILL.md
---

# Requirements (Product Logic)

1. **Tracking Scope:**
- *Native platforms only:* Tracker is active exclusively when `Capacitor.isNativePlatform()` returns `true`. Web users are never tracked.
- *New users only (Phase 1):* Only track users whose `createdAt` is within the last 7 days. This constraint is lifted in future phases.

2. **Tracker Lifecycle:**
- *Mount:* A new tracker record is created on `AppLayout` mount. A `trackerId` (`crypto.randomUUID()`) is generated and stored in Zustand for the duration of the app session.
- *Unmount:* Tracker is closed with `endedAt` timestamp and final `status` (`drop` or `complete`).
- *Status Resolution:* `complete` is set explicitly on meaningful terminal actions (e.g. property saved). All other endings default to `drop`.

3. **Event Capture (`useActivityTracker`):**
- *Hook mounted once* in `AppLayout.tsx`. Never in individual components.
- *Click:* Event delegation on `document`. Reads `data-track` first, then `aria-label`, then inner text (truncated to 40 chars).
- *Focus / Blur:* Targets `input`, `textarea`, `select` only. Blur records `filled: true/false`. Password fields (`type="password"`) are never logged by value.
- *Scroll:* Debounced 300ms. Fires once per threshold per page: 25% / 50% / 75% / 100%.
- *Idle:* Fires after 30 seconds of no `mousemove`, `keydown`, or `touchstart`. Resets on any of these events.
- *Navigation:* Captured via React Router `useLocation()` on every `pathname` change.

4. **Event Schema:**
- Every event written to `tracker_events` collection includes:
  - `trackerId` — FK to `trackers` collection
  - `type` — `click | focus | blur | scroll | idle | navigation | api`
  - `tag` — `UI | NAV | SPLASH | SIGNUP | LOGIN | PROPERTY | CALCULATOR | ERROR`
  - `action` — human-readable description
  - `page` — `window.location.pathname` at time of event
  - `timestamp` — `ISODate`
  - `meta` — open object for type-specific context (e.g. `{ field: 'email', filled: true }`)

5. **`data-track` Convention:**
- Add `data-track` to elements whose auto-detected label would be ambiguous.
- The hook reads `data-track` first — it is the override, not the default.
- Example: `<button data-track="calculate-yield">חשב תשואה</button>`
- This attribute is *optional* — only required where auto-detection is insufficient.

6. **DB Size Protection:**
- *TTL Index:* `trackers.createdAt` expires after 30 days automatically.
- *Event cap:* Maximum 200 events per tracker. Hook stops writing silently once cap is reached.
- *New-user gate:* Backend middleware rejects tracker writes for users older than 7 days (Phase 1).

7. **Admin Dashboard (`/admin/tracker`):**
- *Auth Guard:* Requires `permissions.includes('tracker:view')`.
- *Table View:* Lists all trackers with email, active tags, event count, last page, and status (drop / complete).
- *Detail View:* Clicking a row opens a full timeline of `tracker_events`, sorted ascending by `timestamp`.
- *Timeline Row:* Displays tag badge (color-coded), action text, timestamp (`HH:MM:SS`), and page pill.
- *Drop-off Indicator:* Last event in a `drop` tracker is visually marked as the exit point.

# Tailwind Implementation Logic
- *Timeline container:* `flex flex-col gap-3 p-4 bg-slate-50 rounded-xl`
- *Event row:* `flex items-start gap-3 relative`
- *Connector line:* `absolute right-[5px] top-5 bottom-[-12px] w-px bg-slate-200`
- *Tag badge:* `inline-block text-xs font-medium px-2 py-0.5 rounded`
- *Page pill:* `font-mono text-xs bg-white border border-slate-200 rounded px-1.5 py-0.5`
- *Drop-off banner:* `flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-800 text-sm font-medium`

# Files Structure
ROOT-PROJ
└── src/
    ├── hooks/
    │   └── useActivityTracker.ts           # Global event capture hook
    ├── types/
    │   └── tracking.ts                     # ActivityEvent, TrackerRecord interfaces
    ├── pages/
    │   └── admin/
    │       └── TrackerDashboard.tsx        # Main admin orchestrator
    ├── components/
    │   └── tracker/
    │       ├── TrackerTable.tsx            # Sessions table with status
    │       └── TrackerTimeline.tsx         # Per-tracker event timeline
    ├── services/
    │   └── tracker.service.ts             # API calls: POST tracker, POST event
    │── store/
    │   └── slices/
    │       └── tracker.slice.ts           # trackerId, isTracking state
    └── assets/
        └── css/
            └── main.css                      # Tailwind Theme (@theme)  

# Component Specification
```TypeScript
// Usage in Router
<Route path="/admin/tracker" element={<TrackerDashboard />} />

// Hook — mounted once
// AppLayout.tsx
useActivityTracker({ trackerId, userId })
```