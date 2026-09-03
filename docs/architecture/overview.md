# HIMARKA Architecture Overview

**Solar-Powered Smart Mini Cold Storage System for Fresh Vegetables in the North Eastern Region of India**

---

## System Architecture Diagram

```mermaid
graph TD
    subgraph "Physical & Edge Layer"
        ESP32["ESP32 Microcontroller"]
        SENSORS["Sensors (DHT22, MQ-135, ADC)"]
        RELAY["Cooling Compressor Relay"]
        CAM["ESP32-CAM Snapshot Module"]
        SENSORS --> ESP32
        ESP32 --> RELAY
    end

    subgraph "Ingestion & Transport"
        IOT_INGEST["Backend IoT Ingestion (/v1/telemetry/ingest)"]
        FIREBASE_ADAPTER["Firebase Realtime Adapter"]
        ESP32 -- HTTPS POST / Telemetry --> IOT_INGEST
        ESP32 -. Realtime Sync .-> FIREBASE_ADAPTER
    end

    subgraph "Backend Core API (FastAPI)"
        ROUTER["Versioned API (/api/v1/)"]
        SERVICE["Domain Services Layer"]
        REPO["Repositories Layer"]
        AUTH["Role-based Auth Boundary"]
        ROUTER --> SERVICE
        SERVICE --> REPO
    end

    subgraph "Data Persistence"
        PG[("PostgreSQL Database (SQLAlchemy + Alembic)")]
        REPO --> PG
    end

    subgraph "AI / Intelligence Subsystem"
        YOLO["YOLO Produce Detector"]
        SPOIL["Spoilage Risk Predictor"]
        GEMINI["Gemini Multimodal AI Provider"]
        REGISTRY["Model Registry & Metadata"]
        SERVICE -. Asynchronous / Job Queue .-> YOLO
        SERVICE -. Asynchronous / Job Queue .-> SPOIL
        SERVICE -. Server-side Integration .-> GEMINI
    end

    subgraph "Web Client (Vite + React + TS)"
        UI_SHELL["Modular Application Shell"]
        TANSTACK["TanStack Query (Data Fetching)"]
        REALTIME_SUB["Realtime Transport Abstraction"]
        I18N["North Eastern i18n Engine"]
        UI_SHELL --> TANSTACK
        TANSTACK --> ROUTER
        REALTIME_SUB -. Listener .-> FIREBASE_ADAPTER
    end
```

## Architectural Principles
1. **Separation of Concerns:** Frontend handles presentation; Backend governs domain logic and permissions; Database handles relational integrity; AI subsystem encapsulates inference; Firmware controls physical sensors and relays.
2. **Decoupled Realtime Layer:** Firebase operates behind an isolated adapter (`backend/app/integrations/firebase/`), preventing client SDK lock-in.
3. **Strict Validation & No Fake Data:** All incoming sensor telemetry and API calls are validated through Pydantic schemas. Unimplemented AI features respond with explicit `NOT_CONFIGURED` envelopes rather than fabricated metrics.
4. **Decentralized Regional Scalability:** Designed to scale from single cold chambers to village-level cooperatives across Assam, Nagaland, Meghalaya, Mizoram, Manipur, Arunachal Pradesh, Tripura, and Sikkim.
