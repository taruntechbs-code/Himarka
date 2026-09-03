/* =====================================================================
   HIMARKA — Architectural Frontend Engine & Interaction Controller
   ---------------------------------------------------------------------
   Core Capabilities:
     1. Scroll-Driven Cinematic Portal Opening Animation (Reversible)
     2. Growing, Tightening & Splitting "HIMARKA" Wordmark Physics
     3. Statement Image Drift & Rotation with Scroll Linked Movement
     4. Physical Throwable Card Deck for 6 Subsystems (Mouse, Touch, Keyboard)
     5. Roster & Live Data Table Telemetry Synchronization
     6. 9-Language Northeast Regional Translation Engine
     7. Dual Theme Support (Architectural Dark / Crisp Light)
     8. Real-time Firebase & 15s Fallback Telemetry Integration
     9. High-Precision Chart.js Splines (Temperature & Gas/TVOC)
     10. Camera Stream & AI Vision Inspection Overlay
   ===================================================================== */

(function () {
    "use strict";

    /* ---------------- GLOBAL SCOPE SAFE BRIDGES ---------------- */
    let currentLanguage = localStorage.getItem("sitagaraaLanguage") || "English";
    let lastReadings = null;
    let lastVegetable = null;
    let temperatureChart = null;
    let gasChart = null;
    let esp32Connected = false;
    let tempSimInterval = null;
    let cameraOn = false;

    const TEMP_OK_MAX = 8.5;
    const TEMP_CRITICAL_MAX = 12.0;
    const GAS_WARNING_PPM = 350;
    const GAS_CRITICAL_PPM = 650;
    const ESP32_CAM_STREAM_URL = "http://192.168.1.50:81/stream";

    /* ---------------- 1. CINEMATIC PORTAL SCROLL PHYSICS ---------------- */
    function initPortalAnimation() {
        const heroEl = document.getElementById("hero");
        const panelLeft = document.getElementById("panelLeft");
        const panelRight = document.getElementById("panelRight");
        const wordLeft = document.getElementById("wordLeft");
        const wordRight = document.getElementById("wordRight");
        const wordmarkWrap = document.getElementById("wordmarkWrap");
        const dotAmber = document.getElementById("dotAmber");
        const dotTeal = document.getElementById("dotTeal");
        const portalBgImg = document.getElementById("portalBgImg");
        const statementCircle = document.getElementById("statementCircle");

        if (!heroEl || !panelLeft || !panelRight) return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        function onScroll() {
            if (prefersReducedMotion) {
                panelLeft.style.transform = "translateX(-105%)";
                panelRight.style.transform = "translateX(105%)";
                if (portalBgImg) portalBgImg.style.transform = "scale(1)";
                return;
            }

            const heroRect = heroEl.getBoundingClientRect();
            const heroHeight = heroEl.offsetHeight;
            const winHeight = window.innerHeight;

            // Scroll travel within hero track: 0 when hero is at top, 1 when hero finishes
            const scrolled = -heroRect.top;
            const maxScroll = Math.max(1, heroHeight - winHeight);
            const progress = Math.max(0, Math.min(1, scrolled / maxScroll));

            // Smooth cubic acceleration easing
            const easeProgress = Math.pow(progress, 1.15);

            // Left & Right Panels: Move completely beyond viewport (> 100px travel during initial scroll)
            const panelTravel = easeProgress * 105;
            panelLeft.style.transform = `translate3d(-${panelTravel}%, 0, 0)`;
            panelRight.style.transform = `translate3d(${panelTravel}%, 0, 0)`;

            // Background visual: Settles smoothly from scale 1.18 down to 1.00
            if (portalBgImg) {
                const imgScale = Math.max(1.0, 1.18 - easeProgress * 0.18);
                portalBgImg.style.transform = `scale(${imgScale})`;
            }

            // Wordmark: GROWING + TIGHTENING + SPLITTING simultaneously!
            if (wordmarkWrap && wordLeft && wordRight) {
                const wordScale = 1.0 + easeProgress * 0.32;
                const letterSpacingEm = 0.06 - easeProgress * 0.13;
                wordmarkWrap.style.letterSpacing = `${letterSpacingEm}em`;
                wordmarkWrap.style.transform = `translate(-50%, -50%) scale(${wordScale})`;

                const splitDistanceVw = easeProgress * 28;
                wordLeft.style.transform = `translate3d(-${splitDistanceVw}vw, 0, 0)`;
                wordRight.style.transform = `translate3d(${splitDistanceVw}vw, 0, 0)`;

                const fadeProgress = Math.max(0, (progress - 0.72) / 0.28);
                wordmarkWrap.style.opacity = Math.max(0, 1 - fadeProgress * 1.3);
            }

            // Accent Dots: Travel outward to opposite screen quadrants
            if (dotAmber && dotTeal) {
                const dotTravelX = easeProgress * 36;
                const dotTravelY = easeProgress * 24;
                dotAmber.style.transform = `translate(calc(-50% - ${dotTravelX}vw), calc(-50% - ${dotTravelY}vh))`;
                dotTeal.style.transform = `translate(calc(-50% + ${dotTravelX}vw), calc(-50% + ${dotTravelY}vh))`;
            }

            // Subtle Statement Circle Motion (Drift & Rotation)
            if (statementCircle) {
                const statementRect = statementCircle.getBoundingClientRect();
                if (statementRect.top < winHeight && statementRect.bottom > 0) {
                    const circleDist = winHeight - statementRect.top;
                    const circleRot = (circleDist * 0.05) % 360;
                    const circleDrift = (circleDist * 0.04);
                    statementCircle.style.transform = `translate3d(0, ${circleDrift}px, 0) rotate(${circleRot}deg)`;
                }
            }
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        onScroll();
    }

    /* ---------------- 2. THROWABLE PHYSICAL CARD DECK (6 CARDS) ---------------- */
    function initThrowableCardDeck() {
        const deckEl = document.getElementById("cardDeck");
        if (!deckEl) return;

        const cards = Array.from(deckEl.querySelectorAll(".deck-card"));
        if (!cards.length) return;

        let currentIndex = 0;
        const totalCards = cards.length;
        const counterEl = document.getElementById("deckCounter");
        const prevBtn = document.getElementById("deckPrevBtn");
        const nextBtn = document.getElementById("deckNextBtn");

        // Physical stacking profiles (depth, rotation, scale)
        const stackStyles = [
            { x: 0, y: 0, z: 0, rot: 0, scale: 1.0, opacity: 1 },
            { x: 10, y: 12, z: -15, rot: 2.2, scale: 0.96, opacity: 0.92 },
            { x: -10, y: 22, z: -30, rot: -2.6, scale: 0.92, opacity: 0.82 },
            { x: 12, y: 30, z: -45, rot: 3.0, scale: 0.88, opacity: 0.70 },
            { x: -8, y: 36, z: -60, rot: -1.6, scale: 0.84, opacity: 0.58 },
            { x: 4, y: 42, z: -75, rot: 1.2, scale: 0.80, opacity: 0.45 }
        ];

        function applyDeckLayout(animate = true) {
            cards.forEach((card, i) => {
                const offset = (i - currentIndex + totalCards) % totalCards;
                const profile = stackStyles[Math.min(offset, stackStyles.length - 1)];

                card.style.zIndex = totalCards - offset;
                card.style.transition = animate ? "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease" : "none";
                card.style.transform = `translate3d(${profile.x}px, ${profile.y}px, ${profile.z}px) rotate(${profile.rot}deg) scale(${profile.scale})`;
                card.style.opacity = profile.opacity;
                card.setAttribute("aria-hidden", offset === 0 ? "false" : "true");
            });

            if (counterEl) {
                counterEl.textContent = `${currentIndex + 1} / ${totalCards}`;
            }
        }

        function cycleNext() {
            const topCard = cards[currentIndex];
            topCard.style.transition = "transform 0.28s ease, opacity 0.28s ease";
            topCard.style.transform = "translate3d(140%, -10px, 0) rotate(18deg) scale(0.95)";
            topCard.style.opacity = "0";

            setTimeout(() => {
                currentIndex = (currentIndex + 1) % totalCards;
                applyDeckLayout(true);
            }, 180);
        }

        function cyclePrev() {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            const newTopCard = cards[currentIndex];
            newTopCard.style.transition = "none";
            newTopCard.style.transform = "translate3d(-140%, 10px, 0) rotate(-18deg) scale(0.95)";
            newTopCard.style.opacity = "0";

            requestAnimationFrame(() => {
                applyDeckLayout(true);
            });
        }

        // Pointer Drag & Throw Physics
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;

        function onPointerDown(e) {
            const topCard = cards[currentIndex];
            if (!topCard || e.button !== 0) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            currentX = startX;
            currentY = startY;

            topCard.setPointerCapture(e.pointerId);
            topCard.style.transition = "none";
            topCard.style.cursor = "grabbing";
        }

        function onPointerMove(e) {
            if (!isDragging) return;
            currentX = e.clientX;
            currentY = e.clientY;

            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            const rot = deltaX * 0.08;
            const topCard = cards[currentIndex];

            topCard.style.transform = `translate3d(${deltaX}px, ${deltaY * 0.25}px, 0) rotate(${rot}deg) scale(1.03)`;
        }

        function onPointerUp(e) {
            if (!isDragging) return;
            isDragging = false;

            const topCard = cards[currentIndex];
            topCard.style.cursor = "grab";
            try {
                topCard.releasePointerCapture(e.pointerId);
            } catch (_) {}

            const deltaX = currentX - startX;
            const deckWidth = deckEl.offsetWidth || 400;
            const threshold = deckWidth * 0.12; // 12% throw threshold

            if (Math.abs(deltaX) > threshold) {
                const sign = deltaX > 0 ? 1 : -1;
                topCard.style.transition = "transform 0.26s ease, opacity 0.26s ease";
                topCard.style.transform = `translate3d(${sign * 140}%, 0, 0) rotate(${sign * 22}deg)`;
                topCard.style.opacity = "0";

                setTimeout(() => {
                    currentIndex = (currentIndex + 1) % totalCards;
                    applyDeckLayout(true);
                }, 180);
            } else {
                applyDeckLayout(true);
            }
        }

        deckEl.addEventListener("pointerdown", onPointerDown);
        deckEl.addEventListener("pointermove", onPointerMove);
        deckEl.addEventListener("pointerup", onPointerUp);
        deckEl.addEventListener("pointercancel", onPointerUp);

        // Accessible Keyboard Controls
        deckEl.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") {
                e.preventDefault();
                cycleNext();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                cyclePrev();
            }
        });

        if (nextBtn) nextBtn.addEventListener("click", cycleNext);
        if (prevBtn) prevBtn.addEventListener("click", cyclePrev);

        applyDeckLayout(false);
    }

    /* ---------------- 3. MULTILINGUAL TRANSLATION ENGINE ---------------- */
    function t(key, lang) {
        if (typeof TRANSLATIONS === "undefined") return key;
        const dict = TRANSLATIONS[lang] || {};
        return dict[key] || (TRANSLATIONS.English && TRANSLATIONS.English[key]) || key;
    }

    window.handleLanguageChange = function (lang) {
        if (!lang) return;
        currentLanguage = lang;
        localStorage.setItem("sitagaraaLanguage", lang);
        window.applyLanguage(lang);
    };

    window.applyLanguage = function (lang) {
        currentLanguage = lang;

        const langSelect = document.getElementById("languageSelect");
        if (langSelect && langSelect.value !== lang) {
            langSelect.value = lang;
        }

        // Update all data-i18n elements
        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.getAttribute("data-i18n");
            el.textContent = t(key, lang);
        });

        // Re-label charts
        if (temperatureChart && temperatureChart.data.datasets[0]) {
            temperatureChart.data.datasets[0].label = t("temperature_variation", lang);
            temperatureChart.update();
        }
        if (gasChart && gasChart.data.datasets[0]) {
            gasChart.data.datasets[0].label = t("gas_variation", lang);
            gasChart.update();
        }

        // Re-render telemetry & AI produce
        if (lastReadings) {
            renderReadings(lastReadings);
        } else {
            showSimulatedReadings();
        }

        if (lastVegetable) {
            renderVegetable(lastVegetable);
        }

        updateCameraButtonLabel();
    };

    /* ---------------- 4. THEME CONTROLLER ---------------- */
    window.toggleTheme = function () {
        document.body.classList.toggle("dark-theme");
        document.body.classList.toggle("light-theme");
        const activeTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
        localStorage.setItem("sitagaraaTheme", activeTheme);
        updateThemeIcons();
    };

    function updateThemeIcons() {
        const isDark = document.body.classList.contains("dark-theme");
        const btn = document.getElementById("dashboardThemeToggle");
        if (!btn) return;
        btn.innerHTML = isDark
            ? '<svg class="icon icon-sm"><use href="#icon-sun"/></svg>'
            : '<svg class="icon icon-sm"><use href="#icon-moon"/></svg>';
    }

    const savedTheme = localStorage.getItem("sitagaraaTheme");
    if (savedTheme === "light") {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
    } else {
        document.body.classList.add("dark-theme");
        document.body.classList.remove("light-theme");
    }
    updateThemeIcons();

    /* ---------------- 5. TELEMETRY DISPLAY & ALERTS ---------------- */
    function renderReadings(data) {
        if (!esp32Connected && data && data.updatedAt && !data.isSimulated) {
            esp32Connected = true;
            if (tempSimInterval) clearInterval(tempSimInterval);
            setCameraButtonEnabled(true);
            const coolingChip = document.getElementById("coolingChip");
            if (coolingChip) coolingChip.classList.remove("hidden");
        }

        lastReadings = data;

        // Temperature (Updates both Table and Roster)
        if (typeof data.temperature === "number") {
            const formattedTemp = data.temperature.toFixed(1) + t("unit_celsius", currentLanguage);
            const tempEl = document.getElementById("temperature");
            const rosterTemp = document.getElementById("rosterTemp");
            if (tempEl) tempEl.textContent = formattedTemp;
            if (rosterTemp) rosterTemp.textContent = formattedTemp;

            let alertLevel = "normal";
            if (data.temperature > TEMP_CRITICAL_MAX) alertLevel = "critical";
            else if (data.temperature > TEMP_OK_MAX) alertLevel = "warning";
            updateAlert(alertLevel);
        }

        // Cooling status
        const coolingEl = document.getElementById("coolingStateText");
        if (coolingEl) {
            coolingEl.textContent = data.coolingState !== false
                ? t("cooling_active", currentLanguage)
                : t("cooling_standby", currentLanguage);
        }

        // Humidity (Updates both Table and Roster)
        if (typeof data.humidity === "number") {
            const formattedHum = Math.round(data.humidity) + t("unit_percent", currentLanguage);
            const humEl = document.getElementById("humidity");
            const rosterHum = document.getElementById("rosterHumidity");
            const humBar = document.getElementById("humidityBar");
            if (humEl) humEl.textContent = formattedHum;
            if (rosterHum) rosterHum.textContent = formattedHum;
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

        // Gas Level / TVOC (Updates both Table and Roster)
        if (typeof data.gasLevel === "number") {
            const formattedGas = Math.round(data.gasLevel) + " " + t("unit_ppm", currentLanguage);
            const gasEl = document.getElementById("gas");
            const rosterGas = document.getElementById("rosterGas");
            const gasStatusEl = document.getElementById("gasStatusText");
            if (gasEl) gasEl.textContent = formattedGas;
            if (rosterGas) rosterGas.textContent = formattedGas;

            let gasKey = "gas_status_normal";
            if (data.gasLevel >= GAS_CRITICAL_PPM) gasKey = "gas_status_critical";
            else if (data.gasLevel >= GAS_WARNING_PPM) gasKey = "gas_status_warning";

            if (gasStatusEl) gasStatusEl.textContent = t(gasKey, currentLanguage);
        }

        // Solar Battery (%) (Updates both Table and Roster)
        if (typeof data.solar === "number") {
            const formattedSolar = Math.round(data.solar) + t("unit_percent", currentLanguage);
            const solarEl = document.getElementById("solar");
            const rosterBattery = document.getElementById("rosterBattery");
            const solarBar = document.getElementById("solarBar");
            if (solarEl) solarEl.textContent = formattedSolar;
            if (rosterBattery) rosterBattery.textContent = formattedSolar;
            if (solarBar) solarBar.style.width = Math.max(0, Math.min(100, data.solar)) + "%";
        }

        // Solar Power Watts (Updates both Table and Roster)
        if (typeof data.solarWatts === "number") {
            const formattedWatts = Math.round(data.solarWatts) + " " + t("unit_watts", currentLanguage);
            const solarWattsEl = document.getElementById("solarWatts");
            const rosterWatts = document.getElementById("rosterSolarWatts");
            if (solarWattsEl) solarWattsEl.textContent = formattedWatts;
            if (rosterWatts) rosterWatts.textContent = formattedWatts;
        }

        // Preservation Status (Updates both Table and Roster)
        const presEl = document.getElementById("preservationStatus");
        const rosterPres = document.getElementById("rosterPreservation");
        const presText = t("status_optimal", currentLanguage);
        if (presEl) presEl.textContent = presText;
        if (rosterPres) rosterPres.textContent = presText;

        // Timestamp
        if (data.updatedAt) {
            const lastUpdateEl = document.getElementById("lastUpdate");
            if (lastUpdateEl) lastUpdateEl.textContent = new Date(data.updatedAt).toLocaleTimeString();
        }
    }

    function updateAlert(level) {
        const descEl = document.getElementById("alertDesc");
        const stateEl = document.getElementById("alertState");
        if (!descEl || !stateEl) return;

        stateEl.classList.remove("warning", "critical");

        if (level === "critical") {
            descEl.textContent = t("alert_critical_desc", currentLanguage);
            stateEl.innerHTML = '<span class="dot dot-red dot-pulse"></span> ' + t("alert_critical_tag", currentLanguage);
            stateEl.classList.add("critical");
        } else if (level === "warning") {
            descEl.textContent = t("alert_warning_desc", currentLanguage);
            stateEl.innerHTML = '<span class="dot dot-amber dot-pulse"></span> ' + t("alert_warning_tag", currentLanguage);
            stateEl.classList.add("warning");
        } else {
            descEl.textContent = t("alert_normal_desc", currentLanguage);
            stateEl.innerHTML = '<span class="dot dot-green dot-pulse"></span> ' + t("alert_normal_tag", currentLanguage);
        }
    }

    function showSimulatedReadings() {
        if (esp32Connected) return;

        const simTemp = 5.2 + (Math.random() * 2.2 - 1.1);
        const simHumidity = 88 + (Math.random() * 4 - 2);
        const simCo2 = 425 + Math.floor(Math.random() * 30);
        const simGas = 185 + Math.floor(Math.random() * 35);
        const simSolar = 94 + Math.floor(Math.random() * 5);
        const simSolarWatts = 46 + Math.floor(Math.random() * 8);

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

        if (typeof window.addTemperaturePoint === "function") window.addTemperaturePoint(simTemp);
        if (typeof window.addGasPoint === "function") window.addGasPoint(simGas);
    }

    /* ---------------- 6. CAMERA & AI PRODUCE VISION ---------------- */
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
    }

    function setCameraButtonEnabled(enabled) {
        const btn = document.getElementById("cameraToggleBtn");
        if (!btn) return;
        btn.disabled = !enabled;
        updateCameraButtonLabel();
    }

    function setCameraOn(on) {
        cameraOn = on;
        const streamImg = document.getElementById("cameraStream");
        const placeholder = document.getElementById("cameraPlaceholder");
        const cameraBadge = document.getElementById("cameraStatusBadge");
        const cameraBadgeText = document.getElementById("cameraStatusText");
        const box = document.getElementById("detectionBox");
        const aiBadge = document.getElementById("aiCameraActiveBadge");

        if (cameraOn) {
            if (streamImg) {
                streamImg.src = ESP32_CAM_STREAM_URL;
                streamImg.classList.remove("hidden");
            }
            if (placeholder) placeholder.classList.add("hidden");
            if (cameraBadge) cameraBadge.classList.remove("hidden");
            if (cameraBadgeText) cameraBadgeText.textContent = t("status_active", currentLanguage);
            if (box) box.classList.remove("hidden");
            if (aiBadge) aiBadge.classList.remove("hidden");
        } else {
            if (streamImg) {
                streamImg.src = "";
                streamImg.classList.add("hidden");
            }
            if (placeholder) placeholder.classList.remove("hidden");
            if (cameraBadge) cameraBadge.classList.add("hidden");
            if (box) box.classList.add("hidden");
            if (aiBadge) aiBadge.classList.add("hidden");
        }

        updateCameraButtonLabel();
    }

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
            '<div style="display:flex;align-items:center;gap:0.85rem;">' +
            '<div class="text-teal"><svg class="icon"><use href="#icon-leaf"/></svg></div>' +
            '<div>' +
            '<h4 style="font-size:1.05rem;margin-bottom:0.25rem;">' + vegName + '</h4>' +
            '<p style="font-size:0.75rem;color:var(--ink-muted);">' + t("detected_by_ai", currentLanguage) + ' &bull; ' + (data.quantity || "Batch #1") + '</p>' +
            '<div style="display:flex;align-items:center;gap:0.65rem;margin-top:0.4rem;">' +
            '<div class="meter-bar"><div class="meter-fill" style="width:' + freshness + '%"></div></div>' +
            '<small style="font-size:11px;font-weight:700;color:var(--green)">' + freshnessLabel + ' (' + freshness + '%)</small>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div style="text-align:right;">' +
            '<strong style="font-size:1.3rem;font-family:var(--font-display);display:block;">' + (data.daysStored != null ? data.daysStored : "1") + '</strong>' +
            '<span class="label-mono">' + t("days_stored", currentLanguage) + '</span>' +
            '</div>';

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

    /* ---------------- 7. CHART.JS SPLINE VISUALIZATIONS ---------------- */
    function initCharts() {
        const tempCanvas = document.getElementById("temperatureChart");
        if (tempCanvas && typeof Chart !== "undefined") {
            const ctxTemp = tempCanvas.getContext("2d");
            const gradTemp = ctxTemp.createLinearGradient(0, 0, 0, 220);
            gradTemp.addColorStop(0, "rgba(232, 145, 60, 0.35)");
            gradTemp.addColorStop(1, "rgba(232, 145, 60, 0.0)");

            temperatureChart = new Chart(tempCanvas, {
                type: "line",
                data: {
                    labels: [],
                    datasets: [{
                        label: t("temperature_variation", currentLanguage),
                        data: [],
                        borderColor: "#E8913C",
                        borderWidth: 2.5,
                        backgroundColor: gradTemp,
                        fill: true,
                        tension: 0.38,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        pointBackgroundColor: "#E8913C"
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { grid: { color: "rgba(237, 231, 220, 0.06)" }, ticks: { color: "#6C7378", font: { family: "Sora", size: 10 } } },
                        y: { grid: { color: "rgba(237, 231, 220, 0.06)" }, ticks: { color: "#6C7378", font: { family: "Sora", size: 10 } } }
                    },
                    plugins: {
                        legend: { labels: { color: "#EDE7DC", font: { family: "Sora", size: 12, weight: "600" } } }
                    }
                }
            });
        }

        const gasCanvas = document.getElementById("gasChart");
        if (gasCanvas && typeof Chart !== "undefined") {
            const ctxGas = gasCanvas.getContext("2d");
            const gradGas = ctxGas.createLinearGradient(0, 0, 0, 220);
            gradGas.addColorStop(0, "rgba(46, 107, 114, 0.35)");
            gradGas.addColorStop(1, "rgba(46, 107, 114, 0.0)");

            gasChart = new Chart(gasCanvas, {
                type: "line",
                data: {
                    labels: [],
                    datasets: [{
                        label: t("gas_variation", currentLanguage),
                        data: [],
                        borderColor: "#3ea2ad",
                        borderWidth: 2.5,
                        backgroundColor: gradGas,
                        fill: true,
                        tension: 0.38,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        pointBackgroundColor: "#3ea2ad"
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { grid: { color: "rgba(237, 231, 220, 0.06)" }, ticks: { color: "#6C7378", font: { family: "Sora", size: 10 } } },
                        y: { grid: { color: "rgba(237, 231, 220, 0.06)" }, ticks: { color: "#6C7378", font: { family: "Sora", size: 10 } } }
                    },
                    plugins: {
                        legend: { labels: { color: "#EDE7DC", font: { family: "Sora", size: 12, weight: "600" } } }
                    }
                }
            });
        }
    }

    const MAX_CHART_POINTS = 20;
    function pushPoint(chart, val) {
        if (!chart) return;
        const timeLabel = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        chart.data.labels.push(timeLabel);
        chart.data.datasets[0].data.push(val);
        if (chart.data.labels.length > MAX_CHART_POINTS) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        chart.update();
    }

    /* ---------------- 8. EXPOSING GLOBAL HANDLERS ---------------- */
    window.updateReadings = renderReadings;
    window.updateVegetable = renderVegetable;
    window.addTemperaturePoint = function (val) { pushPoint(temperatureChart, val); };
    window.addGasPoint = function (val) { pushPoint(gasChart, val); };

    window.handleContinueClick = function (e) {
        if (e && typeof e.preventDefault === "function") e.preventDefault();
        const monitorEl = document.getElementById("monitor");
        if (monitorEl) monitorEl.scrollIntoView({ behavior: "smooth" });
        return false;
    };

    window.handleWelcomeClick = function (e) {
        if (e && typeof e.preventDefault === "function") e.preventDefault();
        const heroEl = document.getElementById("hero");
        if (heroEl) heroEl.scrollIntoView({ behavior: "smooth" });
        return false;
    };

    /* ---------------- 9. DOM INITIALIZATION ---------------- */
    function init() {
        initPortalAnimation();
        initThrowableCardDeck();
        initCharts();

        // Camera button hook
        const camBtn = document.getElementById("cameraToggleBtn");
        if (camBtn) {
            camBtn.addEventListener("click", () => setCameraOn(!cameraOn));
        }

        // Active language initialization
        window.applyLanguage(currentLanguage);

        // Fallback simulation loop
        showSimulatedReadings();
        tempSimInterval = setInterval(showSimulatedReadings, 15000);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
