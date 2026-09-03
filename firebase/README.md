# Firebase Realtime Database Security Configuration

This directory contains the security rules and configuration guide for the SITAGARAA Firebase Realtime Database.

## Overview

The database currently handles two specific branches:
1. `/liveData`: Written by the ESP32 microcontroller (`esp32_sitagaraa.ino`) with live telemetry.
2. `/vegetableInfo`: Written by the edge AI detection service (`ai_vegetable_detector.py`) with produce classifications.

Both paths are read publicly by the farmer web dashboard (`frontend/js/firebase-config.js`).

## Proposed Rules (`database.rules.json`)

The rules file enforces:
- **Zero Root Access**: Root `.read: false` and `.write: false` prevent enumeration or root wipeout.
- **Strict Scope**: Read and write access are strictly scoped to `/liveData` and `/vegetableInfo`. All other paths are blocked.
- **Schema Validation**: 
  - `/liveData` rejects any payloads lacking required `temperature` and `humidity` metrics or containing invalid data types (e.g., negative humidity or non-numeric sensor readings).
  - `/vegetableInfo` validates data types for produce labels, confidence scores (0.0 to 1.0), and storage timestamps.
  - `$other: { ".validate": false }` prevents unauthorized arbitrary keys from polluting either node.

## Production Roadmap: Authenticated Ingestion

In the current prototype, the Python detector communicates via unauthenticated REST HTTP requests (`FIREBASE_AUTH = ""`). Applying `"auth != null"` immediately would break the computer vision pipeline.

For a hardened production deployment:
1. **ESP32 Device Authentication**:
   - Provision a dedicated device account via Firebase Authentication (Email/Password or Custom Token).
   - Require `auth != null` on `/liveData`.
2. **AI Detection Authentication**:
   - Migrate `ai_vegetable_detector.py` to use the Firebase Admin SDK with a private service account JSON, or authenticate via Firebase REST Auth.
   - Require `auth != null` on `/vegetableInfo`.
3. **App Check**:
   - Enable Firebase App Check with reCAPTCHA Enterprise on the web client to prevent unauthorized scraping of the public telemetry feeds.
