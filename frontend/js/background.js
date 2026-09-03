/* =====================================================================
   SITAGARAA — Animated Background Canvas
   ---------------------------------------------------------------------
   Creates an atmospheric cold chain ambient background with:
     1. Sky aurora gradient & subtle solar energy hex grid
     2. Radial mouse glow
     3. Rising & falling frost particles (snowfall motes)
     4. Theme-aware color adaptation
   ===================================================================== */

(function () {
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, DPR;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function themeColors() {
    const isDark = document.body.classList.contains("dark-theme");
    return {
      isDark: isDark,
      cyan: isDark ? "#3ea2ad" : "#1F555C",
      blue: isDark ? "#2E6B72" : "#2E6B72",
      solar: isDark ? "#E8913C" : "#C66E1D"
    };
  }

  let motes = [];
  function spawnMote(fresh) {
    // Spawns from a random edge — top, left, or right — so snow
    // enters from every side of the screen, not just recycling
    // from one spot. `fresh` places it just outside that edge;
    // otherwise it's scattered anywhere on screen (used for the
    // very first build, so it doesn't look empty on load).
    const edge = Math.floor(Math.random() * 3); // 0=top, 1=left, 2=right
    let x, y;

    if (!fresh) {
      x = Math.random() * W;
      y = Math.random() * H;
    } else if (edge === 0) {
      x = Math.random() * W;
      y = -10;
    } else if (edge === 1) {
      x = -10;
      y = Math.random() * H;
    } else {
      x = W + 10;
      y = Math.random() * H;
    }

    return {
      x, y,
      r: 1.0 + Math.random() * 2.8,
      vy: 0.3 + Math.random() * 0.9,             // falling speed
      vx: (Math.random() - 0.5) * 0.6,            // gentle drift
      alpha: 0.15 + Math.random() * 0.45,
      twinkle: Math.random() * Math.PI * 2
    };
  }

  function buildMotes() {
    motes = [];
    const count = 420; // more falls
    for (let i = 0; i < count; i++) {
      motes.push(spawnMote(false));
    }
  }

  let mouseX = 0.5, mouseY = 0.5;
  window.addEventListener("mousemove", e => {
    mouseX = e.clientX / W;
    mouseY = e.clientY / H;
  });

  let t = 0;
  function frame() {
    t += 1;
    const theme = themeColors();

    // Atmospheric Gradient Background
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    if (theme.isDark) {
      grad.addColorStop(0, "#030f1e");
      grad.addColorStop(0.4, "#06182c");
      grad.addColorStop(0.8, "#09223d");
      grad.addColorStop(1, "#030f1e");
    } else {
      grad.addColorStop(0, "#edf9ff");
      grad.addColorStop(0.5, "#e0f4ff");
      grad.addColorStop(1, "#d4f0ff");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Mouse Glow Accent
    const glow = ctx.createRadialGradient(W * mouseX, H * mouseY, 0, W * mouseX, H * mouseY, Math.max(W, H) * 0.6);
    if (theme.isDark) {
      glow.addColorStop(0, "rgba(0, 229, 255, 0.14)");
      glow.addColorStop(0.5, "rgba(0, 229, 255, 0.04)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    } else {
      glow.addColorStop(0, "rgba(14, 165, 233, 0.14)");
      glow.addColorStop(0.5, "rgba(14, 165, 233, 0.03)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    }
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Snowfall — falls downward, drifting in from every side
    motes.forEach((m, i) => {
      m.y += m.vy;
      m.x += m.vx + Math.sin(t * 0.02 + m.twinkle) * 0.2;

      if (m.y > H + 10 || m.x < -10 || m.x > W + 10) {
        motes[i] = spawnMote(true);
        return;
      }

      const twinkleAlpha = m.alpha * (0.6 + 0.4 * Math.sin(t * 0.04 + m.twinkle));
      ctx.fillStyle = theme.isDark ? `rgba(0, 229, 255, ${twinkleAlpha})` : `rgba(2, 132, 199, ${twinkleAlpha})`;

      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", () => { resize(); buildMotes(); });
  resize();
  buildMotes();
  requestAnimationFrame(frame);
})();
