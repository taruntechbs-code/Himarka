/* =====================================================================
   SITAGARAA — Smart Cold Storage Dashboard Logic
   ---------------------------------------------------------------------
   Handles:
     1. Instant 9-Language Northeast Translation Engine
     2. Reliable Page Navigation (Welcome Screen -> Command Center)
     3. Dual Theme Switching (Dark Aurora / Crisp Light Mode)
     4. Real-time Firebase & 15s Fallback Demo Telemetry Loop
     5. Dynamic Spline Charts (Temperature & Gas/TVOC)
     6. Camera Stream ON/OFF Controls & AI Vision Inspection Overlay
   ===================================================================== */

/* ---------------- TOP-LEVEL GLOBAL NAVIGATION HANDLERS ---------------- */
window.handleContinueClick = function (e) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    const welcomePage = document.getElementById("welcomePage");
    const dashboardPage = document.getElementById("dashboardPage");
    const languageSelect = document.getElementById("languageSelect");

    if (languageSelect) {
        const selectedLanguage = languageSelect.value;
        localStorage.setItem("sitagaraaLanguage", selectedLanguage);
        if (typeof window.applyLanguage === "function") {
            window.applyLanguage(selectedLanguage);
        }
    }

    if (welcomePage) {
        welcomePage.classList.add("hidden");
        welcomePage.style.display = "none";
    }

    if (dashboardPage) {
        dashboardPage.classList.remove("hidden");
        dashboardPage.style.display = "block";
    }

    window.location.hash = "dashboard";
    const portalIntro = document.getElementById("portalIntro");
    const portalOffset = portalIntro ? Math.max(0, portalIntro.offsetHeight - window.innerHeight + 2) : 0;
    window.scrollTo({ top: portalOffset, behavior: "smooth" });
    return false;
};

window.handleWelcomeClick = function (e) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    const welcomePage = document.getElementById("welcomePage");
    const dashboardPage = document.getElementById("dashboardPage");

    if (dashboardPage) {
        dashboardPage.classList.add("hidden");
        dashboardPage.style.display = "none";
    }

    if (welcomePage) {
        welcomePage.classList.remove("hidden");
        welcomePage.style.display = "grid";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    return false;
};

window.handleLanguageChange = function (val) {
    if (!val) return;
    localStorage.setItem("sitagaraaLanguage", val);
    if (typeof window.applyLanguage === "function") {
        window.applyLanguage(val);
    }
    // Selecting a language only updates the selection — it no longer
    // jumps to the dashboard on its own. Only the Continue button does that.
};

// Global Click Delegation for Continue & Language Buttons
document.addEventListener("click", function (e) {
    const continueTarget = e.target && e.target.closest ? e.target.closest("#continueBtn") : null;
    if (continueTarget) {
        window.handleContinueClick(e);
        return;
    }

    const changeLangTarget = e.target && e.target.closest ? e.target.closest("#changeLanguageBtn") : null;
    if (changeLangTarget) {
        window.handleWelcomeClick(e);
        return;
    }
});

/* ---------------- APPLICATION INITIALIZATION ---------------- */
function initApp() {

    const welcomePage = document.getElementById("welcomePage");
    const dashboardPage = document.getElementById("dashboardPage");

    const continueBtn = document.getElementById("continueBtn");
    const changeLanguageBtn = document.getElementById("changeLanguageBtn");

    const welcomeThemeToggle = document.getElementById("welcomeThemeToggle");
    const dashboardThemeToggle = document.getElementById("dashboardThemeToggle");

    const languageSelect = document.getElementById("languageSelect");
    const selectedLanguageText = document.getElementById("selectedLanguageText");

    // Persisted language state
    let currentLanguage = localStorage.getItem("sitagaraaLanguage") || "English";

    if (languageSelect && languageSelect.options) {
        if (!Array.from(languageSelect.options).some(opt => opt.value === currentLanguage)) {
            currentLanguage = "English";
            localStorage.setItem("sitagaraaLanguage", currentLanguage);
        }
    }

    let lastReadings = null;
    let lastVegetable = null;

    // Chart instances — declared here (not down near the Chart.js
    // setup code) because window.applyLanguage() references them
    // and gets called during page init, before the canvases are
    // built. Referencing a `let` variable before its declaration
    // line has run throws a ReferenceError in JS, which was silently
    // aborting handleContinueClick partway through — that's why the
    // button looked broken. Declaring them early with null fixes it;
    // the actual Chart.js objects still get assigned later, in the
    // chart-setup section further down.
    let temperatureChart = null;
    let gasChart = null;

    // Same reason these move up: renderReadings() (which uses them)
    // gets called via applyLanguage() during init, before this point
    // in the file was previously reached.
    const TEMP_OK_MAX = 8.5;
    const TEMP_CRITICAL_MAX = 12.0;
    const GAS_WARNING_PPM = 350;
    const GAS_CRITICAL_PPM = 650;

    // Simulation state
    let esp32Connected = false;
    let tempSimInterval = null;

    // Camera Stream State
    const ESP32_CAM_STREAM_URL = "http://192.168.1.50:81/stream";
    let cameraOn = false;

    if (continueBtn) {
        continueBtn.addEventListener("click", window.handleContinueClick);
    }

    if (changeLanguageBtn) {
        changeLanguageBtn.addEventListener("click", window.handleWelcomeClick);
    }

    if (languageSelect) {
        languageSelect.addEventListener("change", function () {
            window.handleLanguageChange(languageSelect.value);
        });
    }

    /* ---------------- Camera Controls ---------------- */
    function updateCameraButtonLabel() {
        const btn = document.getElementById("cameraToggleBtn");
        if (!btn) return;
        if (btn.disabled) {
            btn.textContent = t("camera_connect_first", currentLanguage);
            return;
        }
        btn.textContent = cameraOn
            ? t("camera_turn_off", currentLanguage)
            : t("camera_turn_on", currentLanguage);
        btn.classList.toggle("is-on", cameraOn);
    }

    function setCameraButtonEnabled(enabled) {
        const btn = document.getElementById("cameraToggleBtn");
        if (!btn) return;
        btn.disabled = !enabled;
        updateCameraButtonLabel();
    }

    function updateAiCameraBadge() {
        const badge = document.getElementById("aiCameraActiveBadge");
        if (!badge) return;
        // Only ever says "active" once the ESP32 is actually
        // connected AND the camera has been turned on — not a
        // permanent label like it was before.
        badge.classList.toggle("hidden", !(esp32Connected && cameraOn));
    }

    function setCameraOn(on) {
        cameraOn = on;
        const streamImg = document.getElementById("cameraStream");
        const placeholder = document.getElementById("cameraPlaceholder");
        const cameraBadge = document.getElementById("cameraStatusBadge");
        const cameraBadgeText = document.getElementById("cameraStatusText");
        const box = document.getElementById("detectionBox");

        if (cameraOn) {
            if (streamImg) {
                streamImg.src = ESP32_CAM_STREAM_URL;
                streamImg.classList.remove("hidden");
            }
            if (placeholder) placeholder.classList.add("hidden");
            if (cameraBadge) cameraBadge.classList.remove("hidden");
            if (cameraBadgeText) cameraBadgeText.textContent = t("status_active", currentLanguage);
            if (box) box.classList.remove("hidden");
        } else {
            if (streamImg) {
                streamImg.src = "";
                streamImg.classList.add("hidden");
            }
            if (placeholder) placeholder.classList.remove("hidden");
            if (cameraBadge) cameraBadge.classList.add("hidden");
            if (box) box.classList.add("hidden");
        }

        updateCameraButtonLabel();
        updateAiCameraBadge();
    }

    const cameraToggleBtn = document.getElementById("cameraToggleBtn");
    if (cameraToggleBtn) {
        cameraToggleBtn.addEventListener("click", function (e) {
            if (e) e.preventDefault();
            if (cameraToggleBtn.disabled) return;
            setCameraOn(!cameraOn);
        });
    }
    setCameraButtonEnabled(false); // starts disabled until the ESP32 actually connects

    /* ---------------- Telemetry Simulation Loop ---------------- */
    function showSimulatedReadings() {
        if (esp32Connected) return;

        const simTemp = Math.random() * 20;        // 0-20°C
        const simHumidity = 85 + Math.random() * 10; // 85-95%
        const simCo2 = 415 + Math.floor(Math.random() * 45);
        const simGas = 180 + Math.floor(Math.random() * 60);
        const simSolar = 90 + Math.floor(Math.random() * 9);
        const simSolarWatts = 42 + Math.floor(Math.random() * 12);

        renderReadings({
            temperature: simTemp,
            humidity: simHumidity,
            co2: simCo2,
            gasLevel: simGas,
            solar: simSolar,
            solarWatts: simSolarWatts,
            coolingState: true,
            updatedAt: Date.now(),
            isSimulated: true
        });

        // Keep the graphs moving from the start too, not just once
        // the ESP32 connects. Guarded with typeof checks because
        // this can fire (via applyLanguage) before the chart section
        // further down in this file has run and defined these yet.
        if (typeof window.addTemperaturePoint === "function") window.addTemperaturePoint(simTemp);
        if (typeof window.addGasPoint === "function") window.addGasPoint(simGas);
    }

    /* ---------------- Theme Toggle ---------------- */
    function updateThemeButtons() {
        const isDark = document.body.classList.contains("dark-theme");
        const label = isDark
            ? '<svg class="icon icon-sm"><use href="#icon-sun"/></svg> <span data-i18n="theme_light">' + t("theme_light", currentLanguage) + "</span>"
            : '<svg class="icon icon-sm"><use href="#icon-moon"/></svg> <span data-i18n="theme_dark">' + t("theme_dark", currentLanguage) + "</span>";

        if (welcomeThemeToggle) welcomeThemeToggle.innerHTML = label;
        if (dashboardThemeToggle) dashboardThemeToggle.innerHTML = label;
    }

    window.toggleTheme = function () {
        document.body.classList.toggle("dark-theme");
        const currentTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
        localStorage.setItem("sitagaraaTheme", currentTheme);
        updateThemeButtons();
    };

    const savedTheme = localStorage.getItem("sitagaraaTheme");
    if (savedTheme === "light") {
        document.body.classList.remove("dark-theme");
    } else {
        document.body.classList.add("dark-theme");
    }

    if (welcomeThemeToggle) welcomeThemeToggle.addEventListener("click", window.toggleTheme);
    if (dashboardThemeToggle) dashboardThemeToggle.addEventListener("click", window.toggleTheme);

    /* ---------------- Complete Language Switcher ---------------- */
    window.applyLanguage = function (lang) {
        currentLanguage = lang;

        if (languageSelect && languageSelect.value !== lang) {
            languageSelect.value = lang;
        }

        // 1. Update all elements with data-i18n
        document.querySelectorAll("[data-i18n]").forEach(function (el) {
            const key = el.getAttribute("data-i18n");
            el.textContent = t(key, lang);
        });

        // 2. Selected language text under dropdown
        if (selectedLanguageText && languageSelect && languageSelect.selectedIndex >= 0) {
            const selectedOptionLabel = languageSelect.options[languageSelect.selectedIndex].text;
            selectedLanguageText.textContent = selectedOptionLabel + " " + t("lang_selected_suffix", lang);
        }

        // 3. Theme & Camera Buttons
        updateThemeButtons();
        updateCameraButtonLabel();

        // 4. Update Charts
        if (temperatureChart && temperatureChart.data.datasets[0]) {
            temperatureChart.data.datasets[0].label = t("temperature_variation", lang);
            temperatureChart.update();
        }
        if (gasChart && gasChart.data.datasets[0]) {
            gasChart.data.datasets[0].label = t("gas_variation", lang);
            gasChart.update();
        }

        // 5. Re-render live/simulated readings in new language
        if (lastReadings) {
            renderReadings(lastReadings);
        } else {
            showSimulatedReadings();
        }

        // 6. Re-render AI Vegetable inventory item
        if (lastVegetable) {
            renderVegetable(lastVegetable);
        }
    };

    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
    window.applyLanguage(currentLanguage);

    /* ---------------- Telemetry Rendering ---------------- */

    function renderReadings(data) {
        if (!esp32Connected && data && data.updatedAt && !data.isSimulated) {
            esp32Connected = true;
            if (tempSimInterval) clearInterval(tempSimInterval);
            setCameraButtonEnabled(true);
            const coolingChip = document.getElementById("coolingChip");
            if (coolingChip) coolingChip.classList.remove("hidden");
        }

        lastReadings = data;

        // Temperature
        if (typeof data.temperature === "number") {
            const tempEl = document.getElementById("temperature");
            if (tempEl) tempEl.textContent = data.temperature.toFixed(1) + t("unit_celsius", currentLanguage);

            let alertLevel = "normal";
            if (data.temperature > TEMP_CRITICAL_MAX) alertLevel = "critical";
            else if (data.temperature > TEMP_OK_MAX) alertLevel = "warning";
            updateAlert(alertLevel);
        }

        // Cooling status
        const coolingEl = document.getElementById("coolingStateText");
        if (coolingEl) {
            coolingEl.textContent = data.coolingState !== false ? t("cooling_active", currentLanguage) : t("cooling_standby", currentLanguage);
        }

        // Humidity
        if (typeof data.humidity === "number") {
            const humEl = document.getElementById("humidity");
            const humBar = document.getElementById("humidityBar");
            if (humEl) humEl.textContent = Math.round(data.humidity) + t("unit_percent", currentLanguage);
            if (humBar) humBar.style.width = Math.max(0, Math.min(100, data.humidity)) + "%";
        }

        // CO2 Level
        if (typeof data.co2 === "number") {
            const co2El = document.getElementById("co2");
            const co2Status = document.getElementById("co2Status");
            if (co2El) co2El.textContent = Math.round(data.co2) + " " + t("unit_ppm", currentLanguage);
            if (co2Status) {
                co2Status.textContent = data.co2 < 600 ? t("co2_fresh", currentLanguage) : t("co2_elevated", currentLanguage);
            }
        }

        // Gas Level / TVOC
        if (typeof data.gasLevel === "number") {
            const gasEl = document.getElementById("gas");
            const gasStatusEl = document.getElementById("gasStatusText");
            if (gasEl) gasEl.textContent = Math.round(data.gasLevel) + " " + t("unit_ppm", currentLanguage);

            let gasKey = "gas_status_normal";
            if (data.gasLevel >= GAS_CRITICAL_PPM) gasKey = "gas_status_critical";
            else if (data.gasLevel >= GAS_WARNING_PPM) gasKey = "gas_status_warning";

            if (gasStatusEl) gasStatusEl.textContent = t(gasKey, currentLanguage);
        }

        // Solar Battery (%)
        if (typeof data.solar === "number") {
            const solarEl = document.getElementById("solar");
            const solarBar = document.getElementById("solarBar");
            if (solarEl) solarEl.textContent = Math.round(data.solar) + t("unit_percent", currentLanguage);
            if (solarBar) solarBar.style.width = Math.max(0, Math.min(100, data.solar)) + "%";
        }

        // Solar Power Watts
        if (typeof data.solarWatts === "number") {
            const solarWattsEl = document.getElementById("solarWatts");
            if (solarWattsEl) solarWattsEl.textContent = Math.round(data.solarWatts) + " " + t("unit_watts", currentLanguage);
        }

        // Timestamp
        if (data.updatedAt) {
            const lastUpdateEl = document.getElementById("lastUpdate");
            if (lastUpdateEl) lastUpdateEl.textContent = new Date(data.updatedAt).toLocaleString();
        }
    }

    function updateAlert(level) {
        const descEl = document.getElementById("alertDesc");
        const stateEl = document.getElementById("alertState");
        if (!descEl || !stateEl) return;

        stateEl.classList.remove("warning", "critical");

        if (level === "critical") {
            descEl.textContent = t("alert_critical_desc", currentLanguage);
            stateEl.textContent = t("alert_critical_tag", currentLanguage);
            stateEl.classList.add("critical");
        } else if (level === "warning") {
            descEl.textContent = t("alert_warning_desc", currentLanguage);
            stateEl.textContent = t("alert_warning_tag", currentLanguage);
            stateEl.classList.add("warning");
        } else {
            descEl.textContent = t("alert_normal_desc", currentLanguage);
            stateEl.textContent = t("alert_normal_tag", currentLanguage);
        }
    }

    /* ---------------- AI Vegetable Detection Rendering ---------------- */
    function renderVegetable(data) {
        lastVegetable = data;

        const list = document.getElementById("vegetableList");
        const emptyNote = document.getElementById("vegetableEmptyNote");
        if (!list) return;

        if (emptyNote) emptyNote.remove();

        let row = document.getElementById("veg-row-current");
        if (!row) {
            row = document.createElement("div");
            row.id = "veg-row-current";
            row.className = "vegetable-item";
            list.appendChild(row);
        }

        // Map common vegetable names to translation keys if available
        let vegName = data.name || "Organic Tomatoes";
        if (vegName.toLowerCase().includes("tomato")) vegName = t("veg_tomatoes", currentLanguage);
        else if (vegName.toLowerCase().includes("cabbage")) vegName = t("veg_cabbage", currentLanguage);
        else if (vegName.toLowerCase().includes("chili") || vegName.toLowerCase().includes("jolokia")) vegName = t("veg_kingchili", currentLanguage);
        else if (vegName.toLowerCase().includes("ginger")) vegName = t("veg_ginger", currentLanguage);
        else if (vegName.toLowerCase().includes("cucumber")) vegName = t("veg_cucumber", currentLanguage);
        else if (vegName.toLowerCase().includes("potato")) vegName = t("veg_potato", currentLanguage);

        const freshness = data.freshnessScore || 95;
        const freshnessLabel = freshness > 85 ? t("freshness_good", currentLanguage) : (freshness > 60 ? t("freshness_medium", currentLanguage) : t("freshness_bad", currentLanguage));

        row.innerHTML =
            '<div class="veg-icon"><svg class="icon"><use href="#icon-leaf"/></svg></div>' +
            '<div class="veg-info">' +
            '<h3>' + vegName + '</h3>' +
            '<p>' + t("detected_by_ai", currentLanguage) + ' • ' + (data.quantity || "Stored Batch") + '</p>' +
            '<div class="freshness-meter">' +
            '<div class="meter-bar"><div class="meter-fill" style="width:' + freshness + '%"></div></div>' +
            '<small style="font-size:11px;font-weight:700;color:var(--green)">' + freshnessLabel + ' (' + freshness + '%)</small>' +
            '</div>' +
            '</div>' +
            '<div class="days">' +
            '<strong>' + (data.daysStored != null ? data.daysStored : "0") + '</strong>' +
            '<span>' + t("days_stored", currentLanguage) + '</span>' +
            '</div>';

        // Update detection box label
        const labelEl = document.getElementById("detectionLabel");
        const confEl = document.getElementById("detectionConfidence");

        if (labelEl) labelEl.textContent = vegName;
        if (confEl) {
            const confVal = typeof data.confidence === "number"
                ? (data.confidence <= 1 ? Math.round(data.confidence * 100) : Math.round(data.confidence))
                : 98;
            confEl.innerHTML = confVal + '% <span data-i18n="unit_match">' + t("unit_match", currentLanguage) + '</span>';
        }
    }

    window.updateReadings = renderReadings;
    window.updateVegetable = renderVegetable;

    /* ---------------- Chart.js Setup ---------------- */
    const tempCanvas = document.getElementById("temperatureChart");
    if (tempCanvas && typeof Chart !== "undefined") {
        const ctxTemp = tempCanvas.getContext("2d");
        const gradTemp = ctxTemp.createLinearGradient(0, 0, 0, 200);
        gradTemp.addColorStop(0, "rgba(0, 229, 255, 0.4)");
        gradTemp.addColorStop(1, "rgba(0, 229, 255, 0.0)");

        temperatureChart = new Chart(tempCanvas, {
            type: "line",
            data: {
                labels: [],
                datasets: [{
                    label: t("temperature_variation", currentLanguage),
                    data: [],
                    borderColor: "#00e5ff",
                    borderWidth: 3,
                    backgroundColor: gradTemp,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointBackgroundColor: "#00e5ff"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#8cbddc" } },
                    y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#8cbddc" } }
                },
                plugins: {
                    legend: { labels: { color: "#f0f9ff", font: { family: "Inter", weight: "bold" } } }
                }
            }
        });
    }

    const gasCanvas = document.getElementById("gasChart");
    if (gasCanvas && typeof Chart !== "undefined") {
        const ctxGas = gasCanvas.getContext("2d");
        const gradGas = ctxGas.createLinearGradient(0, 0, 0, 200);
        gradGas.addColorStop(0, "rgba(0, 230, 118, 0.4)");
        gradGas.addColorStop(1, "rgba(0, 230, 118, 0.0)");

        gasChart = new Chart(gasCanvas, {
            type: "line",
            data: {
                labels: [],
                datasets: [{
                    label: t("gas_variation", currentLanguage),
                    data: [],
                    borderColor: "#00e676",
                    borderWidth: 3,
                    backgroundColor: gradGas,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointBackgroundColor: "#00e676"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#8cbddc" } },
                    y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#8cbddc" } }
                },
                plugins: {
                    legend: { labels: { color: "#f0f9ff", font: { family: "Inter", weight: "bold" } } }
                }
            }
        });
    }

    const MAX_CHART_POINTS = 20;
    function pushPoint(chart, value) {
        if (!chart) return;
        const timeLabel = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        chart.data.labels.push(timeLabel);
        chart.data.datasets[0].data.push(value);
        if (chart.data.labels.length > MAX_CHART_POINTS) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        chart.update();
    }

    window.addTemperaturePoint = function (val) { pushPoint(temperatureChart, val); };
    window.addGasPoint = function (val) { pushPoint(gasChart, val); };

    // Kick off 15-second simulation loop immediately
    showSimulatedReadings();
    tempSimInterval = setInterval(showSimulatedReadings, 15000);

    // Initialize Cinematic Portal Opening Animation
    initPortalIntro();
}

/* ---------------- CINEMATIC PORTAL SCROLL PHYSICS ---------------- */
function initPortalIntro() {
    const introEl = document.getElementById("portalIntro");
    const stageEl = document.getElementById("portalStickyStage");
    const leftHalf = document.getElementById("portalHalfLeft");
    const rightHalf = document.getElementById("portalHalfRight");
    const wordmarkWrap = document.getElementById("portalWordmarkContainer");
    const wordHim = document.getElementById("portalWordHim");
    const wordArka = document.getElementById("portalWordArka");
    const centerContent = document.getElementById("portalCenterContent");

    if (!introEl || !leftHalf || !rightHalf || !wordmarkWrap) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        introEl.style.display = "none";
        return;
    }

    function updatePortal() {
        const rect = introEl.getBoundingClientRect();
        const totalHeight = introEl.offsetHeight;
        const winH = window.innerHeight;
        const maxScroll = Math.max(1, totalHeight - winH);
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / maxScroll));

        // Smooth cubic ease
        const ease = Math.pow(progress, 1.15);

        // 1. Two halves split apart and travel beyond viewport edges (> 100px travel)
        const panelTravel = ease * 105;
        leftHalf.style.transform = `translate3d(-${panelTravel}%, 0, 0)`;
        rightHalf.style.transform = `translate3d(${panelTravel}%, 0, 0)`;

        // 2. Wordmark: SPLIT + EXPAND (Scale) + TIGHTEN (Letter Spacing)
        const scale = 1.0 + ease * 0.28;
        const letterSpacing = 0.05 - ease * 0.12;
        wordmarkWrap.style.letterSpacing = `${letterSpacing}em`;
        wordmarkWrap.style.transform = `scale(${scale})`;

        // Spans move outward
        const splitVw = ease * 25;
        if (wordHim) wordHim.style.transform = `translate3d(-${splitVw}vw, 0, 0)`;
        if (wordArka) wordArka.style.transform = `translate3d(${splitVw}vw, 0, 0)`;

        // Fade center metadata gracefully
        if (centerContent) {
            const fade = Math.max(0, (progress - 0.65) / 0.35);
            centerContent.style.opacity = Math.max(0, 1 - fade * 1.25);
        }

        // Pointer-events toggled when completely open
        if (stageEl) {
            if (progress >= 0.96) {
                stageEl.classList.remove("is-closed");
                stageEl.style.visibility = "hidden";
            } else {
                stageEl.classList.add("is-closed");
                stageEl.style.visibility = "visible";
            }
        }
    }

    window.addEventListener("scroll", updatePortal, { passive: true });
    window.addEventListener("resize", updatePortal, { passive: true });
    updatePortal();
}

// Reliable Initialization Guard
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}
