/* =====================================================================
   SITAGARAA — Firebase configuration & live data wiring
   ---------------------------------------------------------------------
   This is a plain HTML/CSS/JS project (no npm/build step), so the
   modular Firebase Web SDK is imported straight from Google's CDN.
   
   Every reading that arrives here is handed to window.updateReadings()
   and window.updateVegetable() (both defined in script.js), which
   update the dashboard in whichever language is currently selected.
   ===================================================================== */

/* =====================================================================
   SITAGARAA — Firebase configuration & live data wiring
   ===================================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getDatabase,
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Gemini API key from .env (safely checked for vanilla browser environments)
const GEMINI_API_KEY = (typeof import.meta !== "undefined" && import.meta && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY)
  ? import.meta.env.VITE_GEMINI_API_KEY
  : "";

// Optional safety check
if (!GEMINI_API_KEY) {
  console.info("HIMARKA: GEMINI_API_KEY is not configured in .env (running in standard browser mode).");
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWlDnQQbgElBAI2x5MnezQyVTyvvKITAY",
  authDomain: "vegetable-box-system.firebaseapp.com",
  databaseURL:
    "https://vegetable-box-system-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vegetable-box-system",
  storageBucket: "vegetable-box-system.firebasestorage.app",
  messagingSenderId: "753357154695",
  appId: "1:753357154695:web:da33c943944d147ece0b22",
  measurementId: "G-CRDSBC5DMH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

try {
  getAnalytics(app);
} catch (err) {
  console.warn(
    "Firebase Analytics not available in local/file environment:",
    err
  );
}

const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", function () {

  // Real-time listener for live sensor telemetry
  onValue(ref(db, "liveData"), function (snapshot) {
    const d = snapshot.val();
    if (!d) return;

    window.updateReadings({
      temperature: d.temperature,
      humidity: d.humidity,
      co2: d.co2,
      gasLevel: d.gasLevel,
      solar: d.solarBattery,
      solarWatts: d.solarWatts,
      coolingState: d.coolingState,
      updatedAt: d.updatedAt || Date.now()
    });

    if (typeof d.temperature === "number") {
      window.addTemperaturePoint(d.temperature);
    }

    if (typeof d.gasLevel === "number") {
      window.addGasPoint(d.gasLevel);
    }
  });

  // Real-time listener for AI Vision & vegetable detection
  onValue(ref(db, "vegetableInfo"), function (snapshot) {
    const d = snapshot.val();
    if (!d) return;

    window.updateVegetable({
      name: d.currentVegetable,
      confidence: d.confidence,
      freshnessScore: d.freshnessScore,
      daysStored: d.daysStored,
      quantity: d.quantity,
      spoilageAlert: d.spoilageAlert
    });
  });

});

