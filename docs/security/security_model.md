# HIMARKA Security Model & Governance

## 1. Zero Trust Ingestion Boundary
Edge device telemetry is never inherently trusted:
- **Timestamp Integrity:** Max allowed clock skew of 300 seconds prevents replay attacks.
- **Physical Bounds Validation:** Out-of-range sensor readings (e.g. negative gas ppm or temperature > 60°C) are rejected with 422 HTTP responses.
- **Device Registration Check:** Unknown device IDs cannot associate records with existing storage units.

## 2. Secrets Management
- **Never In Git:** All sensitive keys (`SECRET_KEY`, `FIREBASE_CREDENTIALS`, `GEMINI_API_KEY`) reside exclusively in `.env` or container runtime secrets.
- **Frontend Isolation:** Browser JavaScript only receives environment variables explicitly prefixed with `VITE_`. Gemini API keys are strictly server-side.

## 3. Role-Based Access Control (RBAC)
Supported domain roles:
- `ADMIN`: Infrastructure configuration, user provisioning, device key revocation.
- `OPERATOR`: Cold chamber threshold tuning, alert acknowledgments, batch logging.
- `FARMER`: Produce batch tracking, shelf-life visibility, village chamber availability.
- `VIEWER`: Read-only telemetry status.
