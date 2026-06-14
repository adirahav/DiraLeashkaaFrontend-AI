# System Architecture

## Purpose
Provide a concise architecture reference for service boundaries, ownership, and major flows.

---

## System Overview

Dira LeAshkaa is a single-developer, full-stack web application (with an Android companion app) for Israeli real estate yield calculation. The frontend is a React SPA built with Vite, served as static files from the Node.js backend. The backend exposes a REST API, handles auth, and persists data to MongoDB Atlas. Everything runs on a single Render service.

```
┌─────────────────────────────────────────────────┐
│                  Render Service                  │
│                                                  │
│  ┌──────────────┐       ┌─────────────────────┐  │
│  │  React SPA   │──────▶│   Node.js / Express │  │
│  │  (static,    │  HTTP │   REST API           │  │
│  │  /public)    │◀──────│                     │  │
│  └──────────────┘  JSON └──────────┬──────────┘  │
│                                    │              │
└────────────────────────────────────┼─────────────┘
                                     │ Mongoose
                              ┌──────▼──────┐
                              │ MongoDB      │
                              │ (Atlas)      │
                              └─────────────┘

  Android App (Capacitor)
  └──▶ same REST API (HTTPS)
```

---

## Context

**Problem solved:** Yield calculation and property comparison for Israeli residential investment properties.

**Key architectural constraints:**
- Single Render service — frontend and backend are co-deployed; the Vite build output is copied into `backend/public` and served as static files by Express.
- Single developer — minimal ops overhead; no microservices, no message queues.
- Android app shares the same API — the Capacitor-wrapped app communicates with the same REST endpoints as the web client; no separate mobile backend.
- Render free/hobby tier — cold starts are possible; no horizontal scaling.

---

## Primary Components

### Frontend — React SPA (`diraleashkaa-ai-frontend`)
| Concern | Technology |
|---|---|
| Framework | React 19 + React Router v7 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 + SASS |
| State management | Zustand |
| HTTP client | Axios |
| Charts | Recharts |
| Animation | Framer Motion |
| Auth token handling | `jwt-decode` (client-side decode only) |
| Mobile bridge | Capacitor 8 (Android) |

The SPA is built to `dist/`, then copied into the backend's `public/` directory at build time (`xcopy dist ..\..\...\backend\public`). Express serves it as static files and falls back to `index.html` for all non-API routes (client-side routing).

### Backend — Node.js / Express (`diraleashkaa-backend`)
- REST API for all data operations (users, properties, calculations).
- Serves the compiled frontend from `public/`.
- Issues and validates JWT tokens.
- Connects to MongoDB via Mongoose.

### Database — MongoDB Atlas
- Stores user accounts and saved property calculations.
- Accessed exclusively through the backend; never directly from the client.

### Android App — Capacitor wrapper
- The same React SPA compiled with `build-android` target, wrapped in a native Android shell via Capacitor.
- Uses `@capacitor/preferences` for local storage, `@capacitor/filesystem` for file export, `@capacitor/network` for connectivity detection.
- Calls the production backend API over HTTPS.

---

## Data Flow

### Web: Page load
```
Browser → GET / → Express (static) → serves index.html + JS bundle
```

### API request (authenticated)
```
React (Axios) 
  → Authorization: Bearer <JWT>
  → Express route handler
  → JWT middleware validates token
  → Mongoose query
  → MongoDB Atlas
  → JSON response
  → Zustand store update
  → React re-render
```

### Android: same as API flow above, over HTTPS to the production Render URL.

---

## Auth and Org Boundaries

- **Authentication:** JWT-based. The backend issues a signed JWT on login; the client stores it (likely `localStorage` on web, `@capacitor/preferences` on Android) and sends it as a `Bearer` token on every API request.
- **Validation:** Express middleware validates the JWT signature and expiry on all protected routes. Unauthenticated requests receive `401`.
- **Authorization scope:** Single-user model — each user accesses only their own saved properties. No multi-tenant or org-level isolation needed at this stage.
- **No OAuth / social login** at this stage.

---

## External Dependencies

| Service | Purpose | Notes |
|---|---|---|
| MongoDB Atlas | Primary database | Managed cloud Mongo; connection via Mongoose |
| Render | Hosting (backend + static frontend) | Single service; free/hobby tier; cold starts possible |
| Google Play Store | Android app distribution | `com.adirahav.diraleashkaa` |

No other external API integrations (no property portals, no bank rate feeds, no analytics SDK) at this stage.

---

## Operational Concerns

**Logging:**
- No structured logging defined yet. Node.js `console` output captured by Render's log stream.
- Recommended next step: add request logging middleware (e.g., `morgan`) and error logging.

**Monitoring:**
- Render provides basic uptime monitoring and deploy status.
- No application-level alerting or error tracking (e.g., Sentry) in place yet.

**Cold starts:**
- Render free/hobby tier spins down after inactivity. First request after sleep will be slow (~10–30s). Consider upgrading tier or adding an uptime ping if this affects UX.

**Retries and failure handling:**
- Axios on the client handles HTTP errors; no automatic retry logic defined.
- MongoDB Atlas handles its own replication and failover.

**Deployments:**
- Build script copies frontend dist into backend before deploy. This coupling means frontend and backend are always deployed together — intentional at this project scale.


