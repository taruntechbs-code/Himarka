# HIMARKA API Specifications

Interactive Swagger UI is available at `/docs` and ReDoc at `/redoc`.

| Method | Endpoint | Status | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | **IMPLEMENTED** | Complete system health across API, DB, Firebase, and AI |
| `GET` | `/api/v1/health/live` | **IMPLEMENTED** | Liveness probe for container runtime |
| `GET` | `/api/v1/health/ready` | **IMPLEMENTED** | Readiness probe checking database availability |
| `POST` | `/api/v1/auth/register` | **IMPLEMENTED** | Register system user (Admin, Operator, Farmer, Viewer) |
| `POST` | `/api/v1/auth/login` | **IMPLEMENTED** | JWT credential exchange |
| `POST` | `/api/v1/telemetry/ingest`| **IMPLEMENTED** | Edge device sensor telemetry ingestion & validation |
| `GET` | `/api/v1/telemetry/latest`| **IMPLEMENTED** | Most recent sensor reading by device ID |
| `GET` | `/api/v1/telemetry/history`| **IMPLEMENTED** | Historical telemetry query with time window filters |
| `GET` | `/api/v1/devices` | **IMPLEMENTED** | List registered hardware devices |
| `POST` | `/api/v1/devices` | **IMPLEMENTED** | Register new ESP32 / sensor unit |
| `POST` | `/api/v1/devices/heartbeat` | **IMPLEMENTED** | Edge heartbeat with firmware/IP tracking |
| `GET` | `/api/v1/storage` | **IMPLEMENTED** | List mini cold storage units |
| `POST` | `/api/v1/storage` | **IMPLEMENTED** | Register new mini cold storage unit |
| `POST` | `/api/v1/produce/batches` | **IMPLEMENTED** | Register agricultural harvest batch |
| `GET` | `/api/v1/produce/batches/storage/{id}` | **IMPLEMENTED** | List batches by storage unit |
| `GET` | `/api/v1/alerts` | **IMPLEMENTED** | List active alarms and excursions |
| `POST` | `/api/v1/alerts` | **IMPLEMENTED** | Trigger new system alert |
| `POST` | `/api/v1/alerts/{id}/resolve` | **IMPLEMENTED** | Mark alert resolved with audit operator |
| `POST` | `/api/v1/energy` | **IMPLEMENTED** | Record solar generation & battery state |
| `GET` | `/api/v1/energy/latest` | **IMPLEMENTED** | Retrieve latest solar & battery metrics |
| `POST` | `/api/v1/ai/detection` | **PLANNED** | Computer vision inference (Returns 501 NOT_CONFIGURED until checkpoint registered) |
| `POST` | `/api/v1/ai/spoilage-risk` | **PLANNED** | Spoilage risk analysis (Returns 501 NOT_CONFIGURED until calibrated) |
