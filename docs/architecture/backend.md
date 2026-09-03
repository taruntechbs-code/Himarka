# Backend Architecture

## Stack
- **Framework:** FastAPI
- **Validation:** Pydantic v2
- **ORM:** SQLAlchemy 2.0 (Async)
- **Migrations:** Alembic
- **Testing:** pytest + pytest-asyncio

## Layered Design Pattern
```
Route (api/v1/)
  ↓
Schema Validation (schemas/)
  ↓
Service (services/)
  ↓
Repository (db/repositories/)
  ↓
Database / Integrations
```

## API Versioning
All public business logic routes exist under `/api/v1/`:
- `/api/v1/health` (Observability & live component status)
- `/api/v1/telemetry` (Ingestion & historical retrieval)
- `/api/v1/devices` (Device registration & heartbeats)
- `/api/v1/storage` (Cold chamber units)
- `/api/v1/produce` (Agricultural batch records)
- `/api/v1/alerts` (Excursion & threshold alarms)
- `/api/v1/energy` (Solar & battery power monitoring)
- `/api/v1/ai` (Inference execution endpoints)

## Error Envelope
All error responses adhere to standard format:
```json
{
  "error": {
    "code": "DEVICE_NOT_FOUND",
    "message": "Device was not found",
    "request_id": "...",
    "details": {}
  }
}
```
