# Firebase Infrastructure Integration Guide

## Purpose
Firebase is integrated as an optional realtime transport layer for edge telemetry streaming.
The backend interacts with Firebase strictly through the `app/integrations/firebase` adapter, ensuring that neither the FastAPI domain services nor the React frontend are tightly coupled to Firebase vendor SDKs.

## Security Rules
Rules defined in `database.rules.json` enforce:
- Edge telemetry write access restricted to authenticated devices.
- General reads restricted to authenticated users.
- Admin controls restricted to operators and administrators.
