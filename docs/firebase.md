# Firebase Realtime Database Architecture

SITAGARAA utilizes Google Firebase Realtime Database (located in region `asia-southeast1`) for low-latency synchronization across microcontroller firmware, computer vision nodes, and browser interfaces.

## Database URL

```
https://vegetable-box-system-default-rtdb.asia-southeast1.firebasedatabase.app
```

## Schema Reference

### 1. `/liveData`
Populated every 15 seconds by the ESP32 microcontroller (`esp32_sitagaraa.ino`).

| Field | Type | Unit | Description |
|---|---|---|---|
| `temperature` | `number` | °C | Chamber ambient temperature measured by DHT22 |
| `humidity` | `number` | % RH | Chamber relative humidity measured by DHT22 |
| `co2` | `number` | ppm | Computed CO₂ level from MQ-135 sensor |
| `gasLevel` | `number` | raw/ppm | Volatile organic compound reading from MQ-135 |
| `solarBattery`| `number` | % | Solar battery state-of-charge |
| `solarWatts` | `number` | W | Estimated photovoltaic generation power |
| `coolingState`| `string` | text | Current status of the cooling relay (`ACTIVE` or `IDLE`) |
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

## Web Client Subscription

The frontend (`frontend/js/firebase-config.js`) subscribes to realtime changes using Firebase SDK v10 modular API:

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
