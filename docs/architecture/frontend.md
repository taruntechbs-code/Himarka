# Frontend Architecture

## Stack
- **Framework:** React 18 / 19 with TypeScript
- **Tooling:** Vite 5 / 6
- **Data Caching:** TanStack Query v5
- **Routing:** React Router v6
- **Styling:** Vanilla CSS with Design System Tokens (`variables.css`, `reset.css`, `index.css`)
- **Localization:** i18next supporting 9 North Eastern regional languages

## Directory Structure
```
frontend/src/
├── app/          # Core router, providers, client config
├── components/   # Atomic & layout primitives (Header, Sidebar, ErrorBoundary)
├── features/     # Sliced feature modules (dashboard, telemetry, storage, produce, devices, energy, alerts)
├── services/     # API client, auth session, realtime stream abstraction
├── lib/i18n/     # Regional language dictionaries
└── styles/       # Design tokens and resets
```

## Phase 0 Boundaries
Phase 0 only establishes the application shell, routing, typed API client, and error boundaries. The final visual design, animations, and editorial layout will be implemented in Phase 1 without restructuring domain types or service connections.
