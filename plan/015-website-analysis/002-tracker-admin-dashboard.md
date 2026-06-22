# Plan: Tracker — Admin Dashboard (Results)

## Task Overview
Implement the Admin-only analytics dashboard at `/admin/tracker`.
Displays all recorded trackers in a paginated table with per-tracker
event timeline drill-down. Gated behind `tracker:view` permission.

*Reference:* Use the specialized knowledge in
    - @tracker-api.yaml
    - @ui-component-layer/SKILL.md
    - @page-layer/SKILL.md
    - Individual Specs: 
        - @tracker-layer/SKILL.md

## Implementation Steps

**Step 1: Route & Auth Guard**
- Register route: `<Route path="/admin/tracker" element={<TrackerDashboard />} />`.
- Guard: check `loggedinUser.permissions.includes('tracker:view')`.
- If unauthorized ⮕ redirect to `/`.

**Step 2: `TrackerDashboard.tsx` (Page Orchestrator)**
- On mount: call `GET /api/tracker?page=1&pageSize=10`.
- State:
  - `trackers: TrackerRecord[]`
  - `selectedTrackerUUID: string | null`
  - `page: number`
  - `isLoading: boolean`
- Renders `TrackerTable` and conditionally `TrackerTimeline` when a row is selected.

**Step 3: `TrackerTable.tsx`**
- Columns: email, active tags (badge pills), event count, stopped at (page pill), status dot.
- Row click ⮕ sets `selectedTrackerUUID` and fetches `GET /api/tracker/:uuid/event`.
- Selected row highlighted with `bg-slate-50`.
- Pagination controls at the bottom.

**Step 4: `TrackerTimeline.tsx`**
- Renders on row selection.
- Header: 3 stat cards — total events, unique pages, duration.
- Timeline: sorted ascending by `timestamp`.
- Per-event row:
  - Tag badge (color-coded by tag).
  - Action text.
  - Timestamp (`HH:MM:SS`) + page pill.
  - Connector line between events.
- Drop-off indicator: last event in a `drop` tracker renders a red banner —
  "נקודת נשירה — לא היו אירועים נוספים בסשן זה".

## Technical Flow Diagram

ADMIN_MOUNT

⮕ permissions.includes('tracker:view')? No ⮕ REDIRECT /

⮕ GET /api/tracker ⮕ Render TrackerTable

ROW_CLICK ⮕ GET /api/tracker/:uuid/event ⮕ Render TrackerTimeline

## Technical Checklist
- [ ] Route is unreachable without `tracker:view` permission.
- [ ] `TrackerTimeline` only renders after events are fetched — show skeleton while loading.
- [ ] Tag badge colors are consistent with the Debug Logger panel color mapping.
- [ ] Drop-off banner renders only when `tracker.status === 'drop'`.
- [ ] Pagination state resets when navigating away and returning.
- [ ] `dir="rtl"` on all containers.
- [ ] Tailwind-only styling, no SCSS file.


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
### 2026-06-05 — AI Pre-Flight Questions

*AI says:*

Before any code is written, I need answers to the following 6 questions. I will not proceed until you explicitly approve.

---

**Q1 — GET API endpoints (blocker)**

`tracker-api.yaml` only defines two **POST** endpoints. The dashboard needs:
- `GET /api/tracker?page=1&pageSize=10` → paginated tracker list
- `GET /api/tracker/:uuid/event` → events for one tracker

These endpoints **do not exist** in the spec or in `tracker.service.ts`.

Options:
- **A** — Add them to the API spec + service and wire to real backend (requires backend work).
- **B** — Use mock/stub data for now (like `raw_from_ai_studio/screens/AdminDashboard.tsx` does), and leave a `TODO` comment for real API integration later.

➡ **Which option?** And if **A**, do you already have the GET endpoints live on the backend?

> *Your Answer:* (A) the GET endpoints are already live on the backend. The YAML has been updated to include both GET /api/tracker and GET /api/tracker/:trackerUUID/event. No mocks needed.

---

**Q2 — TrackerRecord response shape (blocker)**

The plan calls for displaying: `email`, `active tags`, `event count`, `stopped at`, `status`, `duration`, `unique pages`.

The current tracker DB schema (`tracker-api.yaml`) only stores: `createdAt, endedAt, status, stoppedAt, platform, version` — no `email`, no `tags`, no `eventsCount`, no `duration`, no `pageCount`.

For the GET list to return these fields, the backend must JOIN/aggregate the user + events.

Options:
- **A** — You confirm the GET endpoint returns a rich `TrackerRecord` shape that includes these fields (please paste or describe the shape).
- **B** — We show only what the schema guarantees (`status`, `stoppedAt`, `createdAt`), and compute the rest from the events on the frontend.
- **C** — Use mock data (see Q1-B), and this question is deferred.

➡ **Which option?**

> *Your Answer:* (B)  B — show only what the schema guarantees from the tracker document, and compute the rest from the events on the frontend.
The GET /api/tracker response returns: uuid, userId, createdAt, endedAt, status, stoppedAt, platform, version.
When a row is selected and GET /api/tracker/:uuid/event fires, the frontend derives:

event count — events.length
active tags — [...new Set(events.map(e => e.tag))]
unique pages — [...new Set(events.map(e => e.page))].length
duration — endedAt - createdAt from the tracker document

email is not in the schema — either add it to the backend projection or skip it for now.

---

**Q3 — Layout: inline accordion vs. side panel**

The plan text says `TrackerTimeline` is a **separate component that renders when a row is selected** (implying a side panel or below-table view). The `raw_from_ai_studio` mock uses an **inline accordion** (the timeline expands inside the table row).

Options:
- **A** — Side-by-side layout: table on the left / top, timeline panel on the right / below the table.
- **B** — Inline accordion: row click expands a timeline row inside the table (as in the mock).

➡ **Which layout?**

> *Your Answer:* (B) Inline accordion. AI Studio is the sole source of truth for layout decisions.

---

**Q4 — Pagination vs. infinite scroll**

The plan says "Pagination controls at the bottom." The mock uses **infinite scroll** with an `IntersectionObserver` + "load more" button.

Options:
- **A** — Classic page-number pagination (prev / next / page numbers).
- **B** — Infinite scroll / load-more (as in the mock).

➡ **Which?**

> *Your Answer:* (B) Infinite scroll / load-more (as in the mock).

---

**Q5 — Unauthorized redirect target**

The plan says: *"If unauthorized ⮕ redirect to `/`"*.
The app's catch-all maps `/` → `/login`. So `/` effectively works, but the more direct pattern used elsewhere (e.g., `ProtectedRoute.tsx`) redirects straight to `/login`.

Options:
- **A** — Redirect to `/` (matches the plan literally; relies on the catch-all).
- **B** — Redirect to `/login` (consistent with the rest of the codebase).

➡ **Which?**

> *Your Answer:* (B) Redirect to `/login` (consistent with the rest of the codebase).

---

**Q6 — Tag badge color mapping**

The plan says: *"consistent with the Debug Logger panel color mapping"* (`src/components/debug/LogViewer.tsx`).

`LogViewer.tsx` defines:
| Tag | Color |
|-----|-------|
| LOGIN | blue-100 / blue-700 |
| SIGNUP | violet-100 / violet-700 |
| SPLASH | cyan-100 / cyan-700 |
| PROPERTY | emerald-100 / emerald-700 |
| NAV | orange-100 / orange-700 |
| ERROR | red-200 / red-800 |
| API | indigo-100 / indigo-700 |
| UI | (not in LogViewer — defaults to slate) |

The mock (`raw_from_ai_studio`) uses a **different** palette (SPLASH=blue, LOGIN=purple, SIGNUP=amber, NAV=emerald, etc.).

Options:
- **A** — Use **exactly** `LogViewer.tsx`'s `TAG_COLORS` (plan requirement: "consistent with Debug Logger").
- **B** — Use the mock's palette (matches the AI Studio visual design).

➡ **Which?**

> *Your Answer:* (B) Use the mock's palette (matches the AI Studio visual design).

---

*⛔ STOP — Waiting for your answers before generating any code.*

---
### 2026-06-05 — Decisions Logged, Implementation Approved

**Decisions confirmed:**
| # | Decision |
|---|----------|
| Q1 | Real backend GET endpoints — add to API spec + service |
| Q2 | Backend returns `uuid, userId, createdAt, endedAt, status, stoppedAt, platform, version`. Compute `event count`, `active tags`, `unique pages`, `duration` from events on frontend. Skip `email` — show `userId` |
| Q3 | Inline accordion layout (AI Studio mock is source of truth) |
| Q4 | Infinite scroll + load-more (as in mock) |
| Q5 | Redirect to `/login` on missing `tracker:view` permission |
| Q6 | Use mock's color palette (not LogViewer's) |

**Architecture notes:**
- Route placed inside `AppLayout` but uses `PermissionRoute` (not `ProtectedRoute`) to bypass onboarding redirect for admin users
- `eventsMap: Record<string, TrackerEvent[]>` caches fetched events so re-opening an accordion row doesn't re-fetch
- Search is client-side on loaded data (by `userId` and `stoppedAt`)

*✅ Green light — proceeding to implementation.*