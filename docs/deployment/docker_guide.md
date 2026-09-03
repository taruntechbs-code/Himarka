# HIMARKA Docker & Local Deployment Guide

## Quickstart

### 1. Configure Environment
```bash
cp .env.example .env
```

### 2. Start Services
```bash
docker compose up -d
```
This boots:
- **Backend API**: `http://localhost:8000` (FastAPI + Uvicorn)
- **Frontend App**: `http://localhost:5173` (Vite / Nginx)
- **PostgreSQL**: `localhost:5432`
- **Redis Broker**: `localhost:6379`

### 3. Verify Health
```bash
curl http://localhost:8000/api/v1/health
```

### 4. Interactive API Documentation
Visit `http://localhost:8000/docs` to test endpoints via Swagger UI.
