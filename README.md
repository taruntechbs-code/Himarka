# HIMARKA

> **Solar-Powered Smart Mini Cold Storage System for Fresh Vegetables in the North Eastern Region of India**

---

## 1. Project Overview
**HIMARKA** is a smart, decentralized mini cold storage and produce preservation platform designed specifically for the unique agro-climatic conditions of North Eastern India. By combining solar photovoltaics, low-power edge telemetry (ESP32), cloud/on-premise orchestration (FastAPI + PostgreSQL), and predictive machine learning models, HIMARKA empowers rural farming cooperatives to minimize post-harvest losses for high-value horticultural produce (such as King Chilli, ginger, tomatoes, and cabbage).

This repository contains the **Phase 0 Foundation Architecture** of the platform, establishing a decoupled, enterprise-grade, modular foundation.

---

## 2. Core Architecture
The system is built as a **Modular Monolith** with strict separation of concerns:

```
                          ┌───────────────────────────┐
                          │   WEB CLIENT (Frontend)   │
                          │   Vite + React + TS Shell │
                          └─────────────┬─────────────┘
                                        │ HTTPS / WSS
                                        ▼
                          ┌───────────────────────────┐
                          │     BACKEND API SERVER    │
                          │       FastAPI (/v1)       │
                          └──────┬──────┬──────┬──────┘
                                 │      │      │
           ┌─────────────────────┘      │      └─────────────────────┐
           ▼                            ▼                            ▼
┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
│  RELATIONAL DATABASE │   │  INTEGRATION LAYERS  │   │     AI SUBSYSTEM     │
│ PostgreSQL/SQLAlchemy│   │   - Firebase Adapter │   │  - Computer Vision   │
│  Alembic Migrations  │   │   - IoT Telemetry    │   │  - Spoilage / Fresh  │
└──────────────────────┘   │   - AI Provider      │   │  - Model Registry    │
                           └───────────┬──────────┘   └──────────────────────┘
                                       │
                                       ▼
                          ┌───────────────────────────┐
                          │      IoT / EDGE LAYER     │
                          │  ESP32 Firmware Contract  │
                          └───────────────────────────┘
```

---

## 3. Technology Stack

| Layer | Technologies | Key Responsibilities |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, TanStack Query, React Router, Vanilla CSS Tokens | Lightweight application shell, typed API contracts, regional i18n |
| **Backend** | Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy 2.0 (Async), Alembic | Versioned REST API (`/api/v1`), domain services, IoT ingestion, auth |
| **Database** | PostgreSQL 16 (SQLite for local dev) | Time-series telemetry, device registry, produce batches, alerts |
| **AI / ML** | PyTorch, Ultralytics YOLOv8, scikit-learn | Produce detection, spoilage kinetics, solar forecasting |
| **Edge / IoT** | ESP32-WROOM-32, C++ / Arduino / PlatformIO | Chamber telemetry sampling (DHT22, MQ-135, ADC), cooling relay control |
| **Integrations** | Firebase RTDB (Adapter), Google Gemini (Server Provider) | Realtime event transport & multimodal intelligence |
| **DevOps** | Docker, Docker Compose, Nginx, GitHub Actions | Containerized orchestration and automated CI verification |

---

## 4. Repository Structure

```
himarka/
├── .github/workflows/ci.yml       # GitHub Actions CI pipeline
├── .editorconfig                  # Code formatting conventions
├── .env.example                   # Environment variable template
├── .gitignore                     # Git ignore rules (secrets & weights excluded)
├── docker-compose.yml             # Local multi-container development environment
├── Makefile                       # Developer command shortcuts
├── package.json                   # Root monorepo workspace definition
├── README.md                      # Primary project documentation
├── LICENSE                        # MIT License
│
├── frontend/                      # Vite + React + TypeScript Application Shell
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── app/                   # Router, providers, configuration
│       ├── components/            # Shell layout & feedback components
│       ├── features/              # Modular domain features (dashboard, telemetry, etc.)
│       ├── services/              # Typed API client, auth, realtime abstraction
│       ├── lib/i18n/              # North Eastern regional language dictionaries
│       ├── types/domain.ts        # TypeScript domain data contracts
│       └── styles/                # CSS custom property design system tokens
│
├── backend/                       # FastAPI Asynchronous Core API
│   ├── pyproject.toml
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── alembic.ini
│   ├── app/
│   │   ├── main.py                # FastAPI app entry with middlewares & error handlers
│   │   ├── api/v1/                # Versioned REST endpoints (health, telemetry, etc.)
│   │   ├── core/                  # Settings, structured logging, exceptions, security
│   │   ├── db/                    # SQLAlchemy async engine, base, models, repositories
│   │   ├── schemas/               # Pydantic domain models & request/response contracts
│   │   ├── services/              # Business logic service layer
│   │   ├── integrations/          # Decoupled Firebase, IoT ingestion, & AI adapters
│   │   └── workers/               # Background task architecture
│   └── tests/                     # Unit, schema, and API test suites (pytest)
│
├── ai/                            # AI/ML Subsystem & Research
│   ├── README.md
│   ├── requirements.txt
│   ├── vision/                    # Preprocessing, YOLO detection, inference
│   ├── prediction/                # Shelf-life estimation & spoilage risk models
│   ├── anomaly/                   # Environmental anomaly detection
│   ├── models/registry/           # Versioned model manifests (metadata.json)
│   ├── datasets/                  # Dataset specifications & split guidelines
│   └── tests/                     # Model registry validation tests
│
├── firmware/esp32/                # Embedded Edge Device Code & Contracts
│   ├── platformio.ini
│   ├── include/telemetry_contract.h # C++ struct matching backend Pydantic models
│   └── src/main.cpp               # Edge sensor sampling sketch
│
├── infrastructure/                # Containerization, Nginx, & Monitoring
│   ├── docker/
│   ├── nginx/default.conf
│   ├── firebase/database.rules.json
│   └── monitoring/prometheus.yml
│
└── docs/                          # Comprehensive Architectural & Technical Documentation
    ├── architecture/              # Overview, frontend, backend, AI, IoT, data-flow
    ├── api/                       # API specifications & status matrix
    ├── database/                  # Schema documentation & ER models
    ├── hardware/                  # ESP32 pinout & wiring contracts
    ├── ai/                        # Model registry & evaluation guidelines
    ├── deployment/                # Docker deployment guide
    └── security/                  # Zero-trust ingestion & secrets model
```

---

## 5. Local Development Setup

### Prerequisites
- Node.js `v20+` & npm `v10+`
- Python `3.11+`
- Docker & Docker Compose (optional for containerized setup)

### Quick Start
1. **Clone and configure environment:**
   ```bash
   cp .env.example .env
   ```
2. **Launch via Docker Compose (Recommended):**
   ```bash
   docker compose up -d
   ```
3. **Or run services locally:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000

   # Terminal 2 - Frontend
   cd frontend
   npm install
   npm run dev
   ```
4. Access services:
   - Frontend Shell: `http://localhost:5173`
   - Backend API Docs: `http://localhost:8000/docs`
   - Health Endpoint: `http://localhost:8000/api/v1/health`

---

## 6. Testing

### Backend & AI Test Suite (pytest)
```bash
python -m pytest backend/tests ai/tests -v
```

### Frontend Type Check & Tests (vitest)
```bash
cd frontend
npm run test
npm run build
```

---

## 7. Development Roadmap

- [x] **Phase 0:** Complete software foundation, data contracts, modular boundaries, CI, and documentation.
- [ ] **Phase 1 (Frontend):** Cinematic intro, scroll-driven editorial portal, live telemetry dashboards, and interactive produce management.
- [ ] **Phase 2 (IoT & Edge):** Physical ESP32 field calibration with DHT22, MQ-135, and DC cooling relay firmware.
- [ ] **Phase 3 (AI Subsystem):** Train YOLO produce detector on North Eastern vegetable datasets and calibrate spoilage kinetics models.
- [ ] **Phase 4 (Field Deployment):** Pilot testing in rural cold storage installations across Assam and Meghalaya.

---

## 8. License
This project is licensed under the [MIT License](file:///c:/Users/tarun/Documents/My%20Projects/Himarka/LICENSE).
