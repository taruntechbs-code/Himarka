# Firebase Realtime Database Architecture & Security Model

SITAGARAA utilizes Google Firebase Realtime Database (located in region `asia-southeast1`) for low-latency synchronization across microcontroller firmware, computer vision nodes, and browser interfaces.

## Database Endpoint

```text
https://vegetable-box-system-default-rtdb.asia-southeast1.firebasedatabase.app
```

---

## Schema Reference

### 1. `/liveData`
Populated every 15 seconds by the ESP32 microcontroller (`firmware/esp32/esp32_sitagaraa.ino`).

| Field | Type | Unit | Description |
|---|---|---|---|
| `temperature` | `number` | °C | Chamber ambient temperature measured by DHT22 |
| `humidity` | `number` | % RH | Chamber relative humidity measured by DHT22 |
| `co2` | `number` | ppm | Computed CO₂ level from MQ-135 sensor |
| `gasLevel` | `number` | raw/ppm | Volatile organic compound reading from MQ-135 |
| `solarBattery`| `number` | % | Solar battery state-of-charge |
| `solarWatts` | `number` | W | Estimated photovoltaic generation power |
| `coolingState`| `string/boolean` | text/bool | Current status of the cooling relay (`ACTIVE` or `IDLE`) |
| `updatedAt` | `number` | epoch ms | Microcontroller timestamp |

### 2. `/vegetableInfo`
Populated by the edge computer vision detector (`ai/ai_vegetable_detector.py`).

| Field | Type | Description |
|---|---|---|
| `currentVegetable` | `string` | Identified produce name (e.g., "Tomato", "Carrot", "Cabbage") |
| `confidence` | `number` | Model inference confidence score (0.0 to 1.0) |
| `freshnessScore` | `number` | Estimated freshness grade |
| `daysStored` | `number` | Number of elapsed days since storage began |
| `quantity` | `number` | Count of detected items |
| `spoilageAlert` | `boolean` | High-risk decay flag |
| `storageStartTime`| `number` | Epoch millisecond timestamp when produce was first placed |
| `detectedAt` | `number` | Timestamp of most recent successful inference |

---

## Web Client Subscription

The frontend (`frontend/js/firebase-config.js`) subscribes to real-time changes using the Firebase Web SDK v10 modular API:

```javascript
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const db = getDatabase(app);

// Live Telemetry Subscription
onValue(ref(db, "liveData"), (snapshot) => {
  const d = snapshot.val();
  if (d) window.updateReadings(d);
});

// AI Produce Subscription
onValue(ref(db, "vegetableInfo"), (snapshot) => {
  const d = snapshot.val();
  if (d) window.updateVegetable(d);
});
```

---

## Security Model

### 1. Public Client Configuration vs. Private Secrets

- **Client Configuration is Public by Design**: The values found in `frontend/js/firebase-config.js` (`apiKey`, `projectId`, `databaseURL`, `appId`, etc.) identify your Firebase project on Google servers. In Firebase web applications, this configuration is visible in the browser by design. The client API key does **not** grant administrative access and is **not** a database secret.
- **Database Security Rules Enforce Authorization**: In Firebase, security is enforced server-side by **Firebase Security Rules**, not by attempting to hide client configuration.
- **Service Account Credentials Must Remain Private**: Administrative credentials (such as Google Cloud service account JSON keys or Firebase database secrets) grant full privileges and must **never** be included in frontend code or committed to GitHub.

---

### 2. Current Security State

- **Frontend**: Operates as a public reader. It connects without authentication and only requires read access to `/liveData` and `/vegetableInfo`. It does not perform any write operations.
- **ESP32 Firmware**: Connects using the Firebase ESP Client library and calls `Firebase.signUp(&config, &auth, "", "")` (Anonymous Authentication), then writes to `/liveData`.
- **Python AI Detector**: Connects directly using unauthenticated HTTP REST requests (`requests.patch()` with `FIREBASE_AUTH = ""`) and writes to `/vegetableInfo`.
- **Database Rules in Repository**: Defined in [`firebase/database.rules.json`](../firebase/database.rules.json).

---

### 3. Known Limitations in Current Prototype Architecture

1. **Unauthenticated REST Ingestion for AI Detector**:
   Because `ai/ai_vegetable_detector.py` sends unauthenticated REST requests, enforcing `".write": "auth != null"` prematurely on `/vegetableInfo` would immediately cause HTTP 401 Unauthorized errors and break AI detection updates.
2. **Anonymous Auth Dependency on Hardware**:
   The ESP32 firmware relies on Anonymous Sign-In. If Anonymous Authentication is not explicitly enabled in the Firebase Console (under Authentication → Sign-in method), the ESP32's `signUp` call will fail.
3. **Open Write Vulnerability without Rules**:
   If the database in the Firebase Console is left in default "Test Mode" (`.read: true, .write: true`), anyone with the database URL could overwrite or delete records.

---

### 4. Recommended Security Rules (`firebase/database.rules.json`)

To secure the database without breaking the current prototype:

```json
{
  "rules": {
    ".read": false,
    ".write": false,

    "liveData": {
      ".read": true,
      ".write": true,
      ".validate": "newData.hasChildren(['temperature', 'humidity'])",
      "temperature": { ".validate": "newData.isNumber()" },
      "humidity": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 100" },
      "co2": { ".validate": "newData.isNumber()" },
      "gasLevel": { ".validate": "newData.isNumber()" },
      "solarBattery": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 100" },
      "solarWatts": { ".validate": "newData.isNumber() && newData.val() >= 0" },
      "coolingState": { ".validate": "newData.isBoolean() || newData.isString()" },
      "updatedAt": { ".validate": "newData.isNumber()" },
      "$other": { ".validate": false }
    },

    "vegetableInfo": {
      ".read": true,
      ".write": true,
      "currentVegetable": { ".validate": "newData.isString() && newData.val().length <= 50" },
      "confidence": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 1" },
      "freshnessScore": { ".validate": "newData.isNumber() || newData.isString()" },
      "daysStored": { ".validate": "newData.isNumber() && newData.val() >= 0" },
      "quantity": { ".validate": "newData.isNumber() || newData.isString()" },
      "spoilageAlert": { ".validate": "newData.isBoolean() || newData.isString()" },
      "storageStartTime": { ".validate": "newData.isNumber()" },
      "detectedAt": { ".validate": "newData.isNumber()" },
      "$other": { ".validate": false }
    }
  }
}
```

**Benefits of these rules**:
- **Prevents Root Overwrite**: Denies write/read access to root or arbitrary paths.
- **Enforces Data Integrity**: Ensures sensor numbers are within logical ranges (e.g. humidity 0–100%) and rejects malformed payloads.
- **Preserves Compatibility**: Allows the existing prototype (ESP32 and Python detector) to function seamlessly.

---

### 5. Recommended Production Architecture (Stage 2)

For production deployment:

1. **Hardware Ingestion**:
   - Provision a dedicated hardware account via Firebase Authentication (Email/Password or Custom Tokens).
   - In `esp32_sitagaraa.ino`, replace anonymous sign-up with email/password sign-in.
   - Update rules: `"liveData": { ".read": true, ".write": "auth != null" }`.
2. **AI Detector Ingestion**:
   - Integrate the `firebase-admin` Python SDK into `ai_vegetable_detector.py`.
   - Use a private service account key (kept local and git-ignored) to write to `/vegetableInfo` with admin credentials, or use Firebase Auth REST tokens.
   - Update rules: `"vegetableInfo": { ".read": true, ".write": "auth != null" }`.
3. **App Check Protection**:
   - Enable **Firebase App Check** (using reCAPTCHA Enterprise for Web and Play Integrity for mobile) to protect the Realtime Database against unauthorized scraper bots.
4. **Google Cloud API Key Restrictions**:
   - In Google Cloud Console (`console.cloud.google.com` → APIs & Services → Credentials):
     - **Application Restrictions**: Restrict the Web API key to HTTP Referrers matching your production domain (e.g., `vegetable-box-system.firebaseapp.com/*`).
     - **API Restrictions**: Restrict the key to only authorize *Firebase Realtime Database* and *Firebase Analytics*.
