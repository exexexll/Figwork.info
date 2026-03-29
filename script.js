/* ============================================
   FIGWORK — Full-Screen Animated Pixel Sunset
              + Wave Text Decode
   ============================================ */

// ─── PAGE DETECTION ─────────────────────────
const isThesisPage = document.body.classList.contains('thesis-page');

// ─── REDUCED MOTION CHECK ───────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── FONT LOADING (thesis page — prevents text jump) ──
if (isThesisPage) {
  document.fonts.ready.then(() => {
    document.body.classList.add('fonts-ready');
  });
  // Fallback: show after 1s even if fonts fail
  setTimeout(() => { document.body.classList.add('fonts-ready'); }, 1000);
}

// ─── HELPERS ─────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }
function lerpC(a, b, t) {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
  ];
}
function rgb(c) { return `rgb(${c[0]},${c[1]},${c[2]})`; }
function hash(n) {
  let x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function vnoise(x, freq, oct) {
  let v = 0, a = 1, f = freq, ta = 0;
  for (let o = 0; o < oct; o++) {
    const i = Math.floor(x * f);
    const fr = (x * f) - i;
    const s = fr * fr * (3 - 2 * fr);
    v += a * lerp(hash(i), hash(i + 1), s);
    ta += a; a *= 0.5; f *= 2;
  }
  return v / ta;
}


// ──────────────────────────────────────────
// 1. FULL-SCREEN ANIMATED PIXEL SUNSET
// ──────────────────────────────────────────
const canvas = document.getElementById('sunsetCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

// Adaptive pixel size: larger pixels on mobile for performance
const isMobile = window.innerWidth <= 600;
const PX = isMobile ? 8 : 6;

// Cap DPR on mobile to save GPU/memory
const MAX_DPR = isMobile ? 1.5 : (window.devicePixelRatio || 1);

const LIGHTING_PHASES = {
  night: {
    skyStops: [
      { p: 0.0, c: [7, 12, 23] },
      { p: 0.15, c: [10, 17, 31] },
      { p: 0.3, c: [15, 23, 40] },
      { p: 0.45, c: [21, 30, 48] },
      { p: 0.6, c: [28, 38, 55] },
      { p: 0.75, c: [34, 45, 61] },
      { p: 0.85, c: [39, 51, 66] },
      { p: 0.93, c: [45, 58, 72] },
      { p: 1.0, c: [51, 64, 78] },
    ],
    deepStops: [
      { p: 0.0, c: [8, 11, 18] },
      { p: 0.3, c: [7, 10, 16] },
      { p: 0.5, c: [6, 9, 14] },
      { p: 0.7, c: [7, 10, 12] },
      { p: 0.85, c: [10, 12, 12] },
      { p: 1.0, c: [12, 12, 10] },
    ],
    overlay: {
      left: 'rgba(5, 8, 14, 0.86)',
      mid: 'rgba(5, 8, 14, 0.55)',
      right: 'rgba(5, 8, 14, 0.18)',
    },
  },
  morning: {
    skyStops: [
      { p: 0.0, c: [34, 48, 72] },
      { p: 0.15, c: [48, 64, 92] },
      { p: 0.3, c: [76, 92, 118] },
      { p: 0.45, c: [118, 128, 142] },
      { p: 0.6, c: [164, 156, 142] },
      { p: 0.75, c: [206, 176, 138] },
      { p: 0.85, c: [224, 190, 146] },
      { p: 0.93, c: [236, 206, 164] },
      { p: 1.0, c: [244, 218, 178] },
    ],
    deepStops: [
      { p: 0.0, c: [10, 14, 18] },
      { p: 0.3, c: [10, 14, 18] },
      { p: 0.5, c: [10, 14, 16] },
      { p: 0.7, c: [13, 14, 12] },
      { p: 0.85, c: [18, 16, 12] },
      { p: 1.0, c: [24, 20, 14] },
    ],
    overlay: {
      left: 'rgba(14, 18, 25, 0.72)',
      mid: 'rgba(14, 18, 25, 0.43)',
      right: 'rgba(14, 18, 25, 0.14)',
    },
  },
  noon: {
    skyStops: [
      { p: 0.0, c: [66, 102, 150] },
      { p: 0.15, c: [78, 116, 166] },
      { p: 0.3, c: [100, 136, 182] },
      { p: 0.45, c: [128, 154, 194] },
      { p: 0.6, c: [162, 176, 206] },
      { p: 0.75, c: [190, 196, 214] },
      { p: 0.85, c: [206, 206, 214] },
      { p: 0.93, c: [218, 214, 214] },
      { p: 1.0, c: [226, 220, 214] },
    ],
    deepStops: [
      { p: 0.0, c: [10, 16, 22] },
      { p: 0.3, c: [10, 14, 20] },
      { p: 0.5, c: [10, 14, 18] },
      { p: 0.7, c: [14, 14, 14] },
      { p: 0.85, c: [20, 18, 14] },
      { p: 1.0, c: [26, 22, 16] },
    ],
    overlay: {
      left: 'rgba(20, 22, 28, 0.62)',
      mid: 'rgba(20, 22, 28, 0.33)',
      right: 'rgba(20, 22, 28, 0.08)',
    },
  },
  evening: {
    skyStops: [
      { p: 0.0, c: [28, 22, 26] },
      { p: 0.15, c: [40, 28, 34] },
      { p: 0.3, c: [66, 38, 46] },
      { p: 0.45, c: [98, 52, 54] },
      { p: 0.6, c: [138, 70, 58] },
      { p: 0.75, c: [176, 96, 62] },
      { p: 0.85, c: [206, 124, 72] },
      { p: 0.93, c: [224, 154, 86] },
      { p: 1.0, c: [236, 182, 104] },
    ],
    deepStops: [
      { p: 0.0, c: [11, 12, 18] },
      { p: 0.3, c: [10, 11, 16] },
      { p: 0.5, c: [10, 11, 14] },
      { p: 0.7, c: [12, 12, 12] },
      { p: 0.85, c: [18, 14, 11] },
      { p: 1.0, c: [24, 18, 12] },
    ],
    overlay: {
      left: 'rgba(10, 11, 14, 0.79)',
      mid: 'rgba(10, 11, 14, 0.5)',
      right: 'rgba(10, 11, 14, 0.16)',
    },
  },
};

function colorFromStops(t, stops) {
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].p && t <= stops[i + 1].p) {
      const lt = (t - stops[i].p) / (stops[i + 1].p - stops[i].p);
      return lerpC(stops[i].c, stops[i + 1].c, lt);
    }
  }
  return stops[stops.length - 1].c;
}

function getSunlightBlend(date = new Date()) {
  const minutes = date.getHours() * 60 + date.getMinutes();
  const schedule = [
    { minute: 0, phase: 'night' },
    { minute: 360, phase: 'morning' },  // 06:00
    { minute: 660, phase: 'noon' },     // 11:00
    { minute: 1020, phase: 'evening' }, // 17:00
    { minute: 1200, phase: 'night' },   // 20:00
    { minute: 1440, phase: 'night' },
  ];

  for (let i = 0; i < schedule.length - 1; i++) {
    const a = schedule[i];
    const b = schedule[i + 1];
    if (minutes >= a.minute && minutes < b.minute) {
      const t = (minutes - a.minute) / Math.max(1, b.minute - a.minute);
      return { from: a.phase, to: b.phase, t };
    }
  }
  return { from: 'night', to: 'night', t: 0 };
}

let manualPhase = null;
let activePhaseForUI = '';
let visualPhase = '';
let phaseTransition = null;
const PHASE_TRANSITION_MS = 1200;

function currentPhaseLabel(blend) {
  return blend.t < 0.5 ? blend.from : blend.to;
}

function setManualPhase(phase) {
  manualPhase = phase;
  syncTimePickerUI();
}

function syncTimePickerUI() {
  const buttons = document.querySelectorAll('.time-square');
  buttons.forEach((btn) => {
    const isActive = btn.dataset.phase === activePhaseForUI;
    btn.classList.toggle('active', isActive);
  });
}

function setupTimePicker() {
  const buttons = document.querySelectorAll('.time-square');
  if (!buttons.length) return;
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const phase = btn.dataset.phase;
      if (!phase) return;
      setManualPhase(phase);
    });
  });
}

const STARFIELD = Array.from({ length: isMobile ? 26 : 54 }, (_, i) => ({
  x: hash(i * 17.13 + 9.7),
  y: hash(i * 31.77 + 2.1) * 0.78,
  speed: 0.6 + hash(i * 19.7 + 1.3) * 1.2,
  seed: hash(i * 47.17 + 7.2),
  size: 1,
}));

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function starVisibilityFromBlend(blend) {
  if (blend.from === 'night' && blend.to === 'night') return 1;
  if (blend.from === 'night' && blend.to !== 'night') return 1 - blend.t;
  if (blend.to === 'night' && blend.from !== 'night') return blend.t;
  return 0;
}

function getInterpolatedStops(kind, blend) {
  const fromStops = LIGHTING_PHASES[blend.from][kind];
  const toStops = LIGHTING_PHASES[blend.to][kind];
  return fromStops.map((stop, i) => ({
    p: stop.p,
    c: lerpC(stop.c, toStops[i].c, blend.t),
  }));
}

function blendOverlay(blend) {
  const from = LIGHTING_PHASES[blend.from].overlay;
  const to = LIGHTING_PHASES[blend.to].overlay;
  const out = { left: from.left, mid: from.mid, right: from.right };
  // Keep this lightweight: use target overlay colors at half-day transitions.
  if (blend.t > 0.5) {
    out.left = to.left;
    out.mid = to.mid;
    out.right = to.right;
  }
  return out;
}

// ── Load fig icon ──
const figImg = new Image();
figImg.src = 'iconfigwork.png';
let figLoaded = false;
let figAspect = 1.25;

figImg.onload = () => {
  figLoaded = true;
  figAspect = figImg.naturalHeight / figImg.naturalWidth;
};

// Pre-render a small pixelated version
let figSmallCanvas = null;
function ensureFigSmall(gridW) {
  if (!figLoaded) return null;
  const gridH = Math.round(gridW * figAspect);
  if (figSmallCanvas && figSmallCanvas.width === gridW && figSmallCanvas.height === gridH) {
    return figSmallCanvas;
  }
  figSmallCanvas = document.createElement('canvas');
  figSmallCanvas.width = gridW;
  figSmallCanvas.height = gridH;
  const sctx = figSmallCanvas.getContext('2d');
  sctx.clearRect(0, 0, gridW, gridH);
  sctx.drawImage(figImg, 0, 0, gridW, gridH);
  return figSmallCanvas;
}

// Moving entities — fewer on mobile
const ships = isMobile ? [
  { x: 0.3, speed: 0.0003, size: 1, y: 0.62, bobPhase: hash(11), bobSpeed: 0.00055, bobAmp: 0.45, renderX: null, renderY: null },
  { x: 0.7, speed: -0.0002, size: 1, y: 0.58, bobPhase: hash(22), bobSpeed: 0.0005, bobAmp: 0.4, renderX: null, renderY: null },
] : [
  { x: 0.15, speed: 0.0003, size: 1, y: 0.62, bobPhase: hash(33), bobSpeed: 0.00055, bobAmp: 0.55, renderX: null, renderY: null },
  { x: 0.55, speed: -0.0002, size: 1.4, y: 0.58, bobPhase: hash(44), bobSpeed: 0.00052, bobAmp: 0.5, renderX: null, renderY: null },
  { x: 0.82, speed: 0.00015, size: 0.8, y: 0.68, bobPhase: hash(55), bobSpeed: 0.00058, bobAmp: 0.38, renderX: null, renderY: null },
];

const seagulls = isMobile ? [
  { x: 0.3, y: 0.2, speed: 0.0006, wing: 0, wingSpeed: 0.08, driftAmp: 0.0035, driftSpeed: 0.00045, renderX: null, renderY: null, seed: hash(101) },
  { x: 0.6, y: 0.15, speed: 0.0004, wing: 0, wingSpeed: 0.06, driftAmp: 0.003, driftSpeed: 0.0004, renderX: null, renderY: null, seed: hash(102) },
  { x: 0.8, y: 0.28, speed: 0.0005, wing: 0, wingSpeed: 0.09, driftAmp: 0.0032, driftSpeed: 0.00048, renderX: null, renderY: null, seed: hash(103) },
] : [
  { x: 0.3, y: 0.2, speed: 0.0006, wing: 0, wingSpeed: 0.08, driftAmp: 0.0038, driftSpeed: 0.00045, renderX: null, renderY: null, seed: hash(201) },
  { x: 0.6, y: 0.15, speed: 0.0004, wing: 0, wingSpeed: 0.06, driftAmp: 0.0032, driftSpeed: 0.00041, renderX: null, renderY: null, seed: hash(202) },
  { x: 0.8, y: 0.28, speed: 0.0005, wing: 0, wingSpeed: 0.09, driftAmp: 0.0034, driftSpeed: 0.00049, renderX: null, renderY: null, seed: hash(203) },
  { x: 0.1, y: 0.35, speed: 0.0003, wing: 0, wingSpeed: 0.07, driftAmp: 0.003, driftSpeed: 0.00037, renderX: null, renderY: null, seed: hash(204) },
  { x: 0.45, y: 0.1, speed: 0.0007, wing: 0, wingSpeed: 0.1, driftAmp: 0.004, driftSpeed: 0.00052, renderX: null, renderY: null, seed: hash(205) },
];

function deepColor(t, stops) {
  return colorFromStops(t, stops);
}

function skyColor(t, stops) {
  return colorFromStops(t, stops);
}

// ── Canvas dimension cache (avoid re-alloc every frame) ──
let _canvasW = 0, _canvasH = 0, _canvasDpr = 0;
let _overlayKey = '';

function syncCanvasSize() {
  const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
  const W = window.innerWidth;
  const H = window.innerHeight;
  if (W === _canvasW && H === _canvasH && dpr === _canvasDpr) return;
  _canvasW = W; _canvasH = H; _canvasDpr = dpr;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
}

function drawSunset(time, frameScale = 1) {
  if (!ctx) return;
  const baseSunlight = manualPhase
    ? { from: manualPhase, to: manualPhase, t: 0 }
    : getSunlightBlend(new Date());
  const desiredPhase = manualPhase || currentPhaseLabel(baseSunlight);

  if (!visualPhase) {
    visualPhase = desiredPhase;
  }

  if (
    desiredPhase !== visualPhase &&
    (!phaseTransition || phaseTransition.to !== desiredPhase)
  ) {
    phaseTransition = {
      from: visualPhase,
      to: desiredPhase,
      start: time,
      duration: PHASE_TRANSITION_MS,
    };
  }

  let sunlight = baseSunlight;
  if (phaseTransition) {
    const rawT = Math.min(1, (time - phaseTransition.start) / phaseTransition.duration);
    const t = easeInOutQuad(rawT);
    sunlight = { from: phaseTransition.from, to: phaseTransition.to, t };
    if (rawT >= 1) {
      visualPhase = phaseTransition.to;
      phaseTransition = null;
      if (!manualPhase) {
        sunlight = baseSunlight;
      }
    }
  } else if (!manualPhase) {
    visualPhase = currentPhaseLabel(baseSunlight);
  }

  const uiPhase = manualPhase || (phaseTransition ? phaseTransition.to : visualPhase);
  if (uiPhase !== activePhaseForUI) {
    activePhaseForUI = uiPhase;
    syncTimePickerUI();
  }
  const skyStopsNow = getInterpolatedStops('skyStops', sunlight);
  const deepStopsNow = getInterpolatedStops('deepStops', sunlight);
  const overlay = blendOverlay(sunlight);
  const overlayKey = `${overlay.left}|${overlay.mid}|${overlay.right}`;
  if (overlayKey !== _overlayKey) {
    _overlayKey = overlayKey;
    document.documentElement.style.setProperty('--overlay-left', overlay.left);
    document.documentElement.style.setProperty('--overlay-mid', overlay.mid);
    document.documentElement.style.setProperty('--overlay-right', overlay.right);
  }

  syncCanvasSize();
  const dpr = _canvasDpr;
  const W = _canvasW;
  const viewH = _canvasH;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const cols = Math.ceil(W / PX);
  const viewRows = Math.ceil(viewH / PX);

  // On thesis page, total scene is taller; we render the visible slice
  const scrollPx = isThesisPage ? window.scrollY : 0;
  const totalH = isThesisPage
    ? Math.max(document.body.scrollHeight, viewH)
    : viewH;
  const totalRows = Math.ceil(totalH / PX);

  const scrollRow = Math.floor(scrollPx / PX);

  const horizon = Math.floor(viewRows * 0.48);
  const oceanEnd = viewRows;
  const deepRows = totalRows - oceanEnd;

  // Fig dimensions in grid units — smaller on mobile
  const figGridW = isMobile ? 22 : 32;
  const figGridH = Math.round(figGridW * figAspect);
  const figCX = Math.floor(cols * 0.6);
  const figLeft = figCX - Math.floor(figGridW / 2);
  const figTopRow = horizon - Math.floor(figGridH * 0.58);
  const starVisibility = starVisibilityFromBlend(sunlight);

  // ── Draw visible rows ──
  for (let vr = 0; vr < viewRows; vr++) {
    const r = vr + scrollRow;
    for (let c = 0; c < cols; c++) {
      let color;

      if (r <= horizon) {
        const t = r / horizon;
        color = skyColor(t, skyStopsNow);

        const dx = c - figCX;
        const dy = r - (figTopRow + figGridH * 0.45);
        const d = Math.sqrt(dx * dx + dy * dy);
        const glowR = Math.max(figGridW, figGridH) * 1.3;
        if (d < glowR) {
          const g = 1 - d / glowR;
          color = lerpC(color, [195, 165, 195], g * g * 0.22);
        }

      } else if (r <= oceanEnd) {
        const wd = (r - horizon) / (oceanEnd - horizon);
        const refRow = horizon - (r - horizon) * 0.6;
        const refT = Math.max(0, refRow) / horizon;
          color = skyColor(Math.min(refT, 1), skyStopsNow);
        color = [
          Math.floor(color[0] * 0.35),
          Math.floor(color[1] * 0.35),
          Math.floor(color[2] * 0.38),
        ];

        const wavePhase = vnoise(c * 0.04 + r * 0.15 + time * 0.0008, 1, 2);
        if (wavePhase > 0.52) {
          const ws = (wavePhase - 0.52) * 4;
          color = lerpC(color, [60, 45, 30], ws * 0.25);
        }

        const distX = Math.abs(c - figCX);
        const shimmerW = figGridW * 0.6 * (1 + wd * 2.5);
        if (distX < shimmerW) {
          const shimmer = vnoise(c * 0.08 + r * 0.5 + time * 0.001, 1, 2);
          if (shimmer > 0.42) {
            const ss = (1 - distX / shimmerW) * (shimmer - 0.42) * 5;
            const fade = Math.max(0, 1 - wd * 1.2);
            color = lerpC(color, [190, 160, 185], ss * 0.2 * fade);
          }
        }

        color = lerpC(color, [18, 18, 16], wd * 0.6);

      } else {
        // DEEP OCEAN
        const dt = Math.min(1, (r - oceanEnd) / Math.max(1, deepRows));
        color = deepColor(dt, deepStopsNow);

        const ray = vnoise(c * 0.02 + dt * 0.5, 1, 2);
        if (ray > 0.55 && dt < 0.4) {
          const strength = (ray - 0.55) * 3 * (1 - dt / 0.4);
          color = lerpC(color, [20, 35, 45], strength * 0.3);
        }

        const particle = vnoise(c * 0.08 + r * 0.12 + time * 0.0003, 1, 3);
        if (particle > 0.62) {
          const ps = (particle - 0.62) * 6;
          color = lerpC(color, [25, 28, 22], ps * 0.15);
        }

        if (dt > 0.7) {
          const floorT = (dt - 0.7) / 0.3;
          const ridge = vnoise(c * 0.025 + 100, 1, 3);
          const ridgeH = ridge * 0.15 * floorT;
          if (dt > 1 - ridgeH) {
            color = lerpC(color, [30, 26, 18], 0.4);
          }
          const rock = vnoise(c * 0.06 + r * 0.04, 1, 2);
          if (rock > 0.68 && floorT > 0.5) {
            color = lerpC(color, [16, 14, 10], (rock - 0.68) * 6 * floorT);
          }
        }

        if (dt > 0.5 && dt < 0.95) {
          const kelpX = Math.floor(c / 8);
          const kelpSeed = hash(kelpX * 73 + 41);
          if (kelpSeed > 0.7) {
            const kelpBase = 0.95;
            const kelpTop = kelpBase - kelpSeed * 0.3;
            if (dt > kelpTop && dt < kelpBase) {
              const kelpCenter = kelpX * 8 + 4;
              const sway = Math.sin(time * 0.0005 + kelpX * 2) * 1.5;
              const kelpDist = Math.abs(c - kelpCenter - sway);
              if (kelpDist < 1.5) {
                color = lerpC(color, [12, 20, 10], 0.35 * (1 - kelpDist / 1.5));
              }
            }
          }
        }

        const fishSeed = hash(Math.floor(r / 12) * 17 + 3);
        if (fishSeed > 0.92 && dt > 0.15 && dt < 0.8) {
          const fishX = (fishSeed * 300 + time * 0.02 * (fishSeed > 0.96 ? -1 : 1)) % cols;
          const distToFish = Math.abs(c - fishX);
          if (distToFish < 2) {
            color = lerpC(color, [6, 8, 12], 0.5);
          }
        }
      }

      const dith = ((c + r) % 2 === 0) ? 1 : -1;
      color = [
        Math.max(0, Math.min(255, color[0] + dith)),
        Math.max(0, Math.min(255, color[1] + dith)),
        Math.max(0, Math.min(255, color[2] + dith)),
      ];

      ctx.fillStyle = rgb(color);
      ctx.fillRect(c * PX, vr * PX, PX, PX);
    }
  }

  // ── Night stars (fade by phase, subtle twinkle) ──
  if (starVisibility > 0.05) {
    for (const star of STARFIELD) {
      const sx = Math.floor(star.x * cols);
      const sy = Math.floor(star.y * Math.max(1, horizon - 2));
      if (sy < 0 || sy >= viewRows) continue;

      const twinkle = 0.5 + 0.5 * Math.sin(time * 0.0012 * star.speed + star.seed * 12.3);
      const alpha = (0.03 + 0.2 * twinkle) * starVisibility;
      ctx.fillStyle = `rgba(228, 234, 245, ${alpha.toFixed(3)})`;
      ctx.fillRect(sx * PX, sy * PX, PX, PX);
    }
  }

  // ── Draw fig ──
  const small = ensureFigSmall(figGridW);
  if (small) {
    const drawX = figLeft * PX;
    const drawY = (figTopRow - scrollRow) * PX;
    const drawW = figGridW * PX;
    const drawH = figGridH * PX;
    const horizonY = (horizon + 1 - scrollRow) * PX;

    if (horizonY > 0 && drawY < viewH) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, Math.max(0, horizonY));
      ctx.clip();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, drawX, drawY, drawW, drawH);
      ctx.restore();
    }

    if (horizonY < viewH) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, Math.max(0, horizonY), W, viewH);
      ctx.clip();
      ctx.translate(0, 2 * horizonY);
      ctx.scale(1, -1);
      ctx.globalAlpha = 0.12;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, drawX, drawY, drawW, drawH);
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }

  // ── SHIPS ──
  for (const ship of ships) {
    ship.x += ship.speed * frameScale;
    let shipWrapped = false;
    if (ship.x > 1.1) { ship.x = -0.1; shipWrapped = true; }
    if (ship.x < -0.1) { ship.x = 1.1; shipWrapped = true; }
    const targetX = ship.x * cols;
    const bob = Math.sin(time * ship.bobSpeed + ship.bobPhase * Math.PI * 2) * ship.bobAmp;
    const targetY = ship.y * viewRows + bob;
    if (ship.renderX == null || shipWrapped) ship.renderX = targetX;
    if (ship.renderY == null) ship.renderY = targetY;
    const follow = Math.min(0.48, 0.28 * frameScale);
    ship.renderX += (targetX - ship.renderX) * follow;
    ship.renderY += (targetY - ship.renderY) * follow;
    const sx = Math.round(ship.renderX);
    const sy = Math.round(ship.renderY) - scrollRow;
    if (sy < -10 || sy > viewRows + 10) continue;
    const s = ship.size;
    const hull = [16, 14, 12];
    for (let dx = -Math.floor(3 * s); dx <= Math.floor(3 * s); dx++) {
      ctx.fillStyle = rgb(hull);
      ctx.fillRect((sx + dx) * PX, sy * PX, PX, PX);
      if (Math.abs(dx) < Math.floor(2 * s)) {
        ctx.fillRect((sx + dx) * PX, (sy - 1) * PX, PX, PX);
      }
    }
    for (let dy = -Math.floor(4 * s); dy < 0; dy++) {
      ctx.fillStyle = rgb(hull);
      ctx.fillRect(sx * PX, (sy + dy) * PX, PX, PX);
    }
    const sail = [30, 26, 22];
    for (let dy = -Math.floor(3 * s); dy <= -1; dy++) {
      const w2 = Math.floor((1 - Math.abs(dy + 2 * s) / (2 * s)) * 2 * s);
      for (let dx = 1; dx <= w2; dx++) {
        ctx.fillStyle = rgb(sail);
        ctx.fillRect((sx + dx) * PX, (sy + dy) * PX, PX, PX);
      }
    }
  }

  // ── SEAGULLS ──
  for (const g of seagulls) {
    g.x += g.speed * frameScale;
    g.wing += g.wingSpeed * frameScale;
    let gullWrapped = false;
    if (g.x > 1.15) { g.x = -0.15; gullWrapped = true; }
    const driftY = Math.sin(time * g.driftSpeed + g.seed * Math.PI * 2) * g.driftAmp * viewRows;
    const targetGX = g.x * cols;
    const targetGY = g.y * viewRows + driftY;
    if (g.renderX == null || gullWrapped) g.renderX = targetGX;
    if (g.renderY == null) g.renderY = targetGY;
    const birdFollow = Math.min(0.52, 0.3 * frameScale);
    g.renderX += (targetGX - g.renderX) * birdFollow;
    g.renderY += (targetGY - g.renderY) * birdFollow;
    const gx = Math.round(g.renderX);
    const gy = Math.round(g.renderY) - scrollRow;
    if (gy < -5 || gy > viewRows + 5) continue;
    const wingY = Math.round(Math.sin(g.wing) * 0.85);
    const birdC = [22, 20, 18];
    ctx.fillStyle = rgb(birdC);
    ctx.fillRect(gx * PX, gy * PX, PX, PX);
    ctx.fillRect((gx - 1) * PX, (gy + wingY) * PX, PX, PX);
    ctx.fillRect((gx - 2) * PX, (gy + wingY + (wingY >= 0 ? -1 : 1)) * PX, PX, PX);
    ctx.fillRect((gx + 1) * PX, (gy + wingY) * PX, PX, PX);
    ctx.fillRect((gx + 2) * PX, (gy + wingY + (wingY >= 0 ? -1 : 1)) * PX, PX, PX);
  }
}

// ── Animation Loop (balanced smoothness/perf) ──
if (!prefersReducedMotion && ctx) {
  let lastFrame = 0;
  const FRAME_MS = isMobile ? 30 : 24; // mobile ~33fps, desktop ~41fps
  function sunsetLoop(time) {
    requestAnimationFrame(sunsetLoop);
    if (time - lastFrame < FRAME_MS) return;
    const deltaMs = lastFrame ? (time - lastFrame) : FRAME_MS;
    lastFrame = time;
    const frameScale = Math.min(2.2, deltaMs / FRAME_MS);
    drawSunset(time, frameScale);
  }
  requestAnimationFrame(sunsetLoop);
}

setupTimePicker();


// ──────────────────────────────────────────
// 2. LANDING INTRO + TEXT REVEAL
// ──────────────────────────────────────────
function runLandingReveal() {
  const decodeEls = [...document.querySelectorAll('.decode')];
  const link = document.querySelector('.link');
  const detail = document.querySelector('.details');
  const waitlist = document.querySelector('.waitlist-wrap');

  if (prefersReducedMotion) {
    decodeEls.forEach((el) => el.classList.add('visible'));
    if (link) link.classList.add('revealed', 'visible');
    if (detail) detail.classList.add('revealed');
    if (waitlist) waitlist.classList.add('visible');
  } else {
    decodeEls.forEach((el, idx) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 220 + idx * 120);
    });

    const totalDelay = 220 + decodeEls.length * 120 + 120;
    setTimeout(() => {
      if (detail) detail.classList.add('revealed');
      if (link) link.classList.add('revealed', 'visible');
      if (waitlist) waitlist.classList.add('visible');
    }, totalDelay);
  }
}

if (!isThesisPage) {
  const introScreen = document.getElementById('introScreen');
  const introCaption = document.getElementById('introCaption');
  const introCarousel = document.getElementById('introCarousel');

  if (!introScreen || !introCaption || !introCarousel || prefersReducedMotion) {
    if (introScreen) introScreen.remove();
    runLandingReveal();
  } else {
    document.body.classList.add('intro-active');
    const words = ['AI', 'Hiring', 'Your Business'];
    let idx = 0;
    let carouselStopped = false;

    introCarousel.style.width = introCarousel.offsetWidth + 'px';

    const carouselInterval = setInterval(() => {
      if (carouselStopped) return;
      idx++;
      if (idx >= words.length) {
        carouselStopped = true;
        clearInterval(carouselInterval);
        return;
      }
      introCarousel.classList.add('is-swap');
      setTimeout(() => {
        introCarousel.textContent = words[idx];
        const measured = introCarousel.scrollWidth;
        introCarousel.style.width = measured + 'px';
        introCarousel.classList.remove('is-swap');
      }, 260);
    }, 1400);

    const CAROUSEL_DURATION = 1400 * words.length + 600;
    const FADE_DURATION = 420;
    const PAUSE_AFTER_FADE = 280;
    const SLIDE_WAIT = 900;
    const HOLD_FINAL = 2400;

    setTimeout(() => {
      clearInterval(carouselInterval);

      const keepSpans = introCaption.querySelectorAll('[data-keep]');
      const measurements = [];
      keepSpans.forEach((span) => {
        const r = span.getBoundingClientRect();
        measurements.push({ text: span.dataset.keep, left: r.left, top: r.top });
      });

      const screenW = introScreen.clientWidth;
      const screenH = introScreen.clientHeight;

      const ghosts = measurements.map((m) => {
        const el = document.createElement('span');
        el.className = 'intro-ghost';
        el.textContent = m.text;
        el.style.left = m.left + 'px';
        el.style.top = m.top + 'px';
        introScreen.appendChild(el);
        return el;
      });

      // Phase A: fade out caption, show ghosts at original positions
      introCaption.classList.add('is-fading');
      requestAnimationFrame(() => {
        ghosts.forEach((el) => el.classList.add('is-placed'));
      });

      // Phase B: after fade completes + pause, slide ghosts together + show icon
      setTimeout(() => {
        const tryW = ghosts[0].offsetWidth;
        const figW = ghosts[1].offsetWidth;
        const workW = ghosts[2].offsetWidth;
        const fontSize = parseFloat(getComputedStyle(ghosts[0]).fontSize);
        const iconSize = Math.round(fontSize * 1.15);
        const wordGap = 8;
        const iconGap = Math.round(iconSize * 0.25);
        const totalW = tryW + wordGap + figW + workW + iconGap + iconSize;
        const startX = (screenW - totalW) / 2;
        const targetY = (screenH / 2) - (fontSize * 0.55);

        ghosts[0].style.left = startX + 'px';
        ghosts[0].style.top = targetY + 'px';
        ghosts[1].style.left = (startX + tryW + wordGap) + 'px';
        ghosts[1].style.top = targetY + 'px';
        ghosts[2].style.left = (startX + tryW + wordGap + figW) + 'px';
        ghosts[2].style.top = targetY + 'px';

        setTimeout(() => {
          const icon = new Image();
          icon.src = 'iconfigwork.png';
          icon.className = 'intro-icon';
          icon.style.width = iconSize + 'px';
          icon.style.height = iconSize + 'px';
          icon.style.objectFit = 'contain';
          icon.style.left = (startX + tryW + wordGap + figW + workW + iconGap) + 'px';
          icon.style.top = (targetY + (fontSize - iconSize) / 2) + 'px';
          introScreen.appendChild(icon);
        }, 500);
      }, FADE_DURATION + PAUSE_AFTER_FADE);

    }, CAROUSEL_DURATION);

    const mergeTotal = CAROUSEL_DURATION + FADE_DURATION + PAUSE_AFTER_FADE + SLIDE_WAIT + HOLD_FINAL;

    setTimeout(() => {
      introScreen.classList.add('is-exit');
      runLandingReveal();
    }, mergeTotal);

    setTimeout(() => {
      introScreen.remove();
      document.body.classList.remove('intro-active');
    }, mergeTotal + 900);
  }
}


// ──────────────────────────────────────────
// 3. CONTACT (email link - no form handler needed)
// ──────────────────────────────────────────

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
