/*
 * Handwritten digit recognition, for "simulations" in topics.json ({ "type": "digit-draw" }).
 * Students draw a digit with the mouse (or a finger) on a 28 x 28 grid, and a small neural
 * network guesses which digit it is, live, while they draw.
 *
 * Why 28 x 28: the network learned from MNIST, 70,000 handwritten digits that are each a
 * 28 x 28 picture, so a drawing of the same size fits it square for square (784 inputs).
 *
 * The network (assets/models/digit-mlp.json) is 784 inputs -> 64 hidden neurons (ReLU) -> 10
 * outputs (softmax), one per digit. Before guessing, the drawing is prepared the way MNIST
 * digits were: cropped, scaled to fit a 20 x 20 box and moved so its centre of mass is in
 * the middle. The prepared picture is shown as "What the model sees".
 */
(() => {
  'use strict';

  const SIZE = 28;                          // the grid is SIZE x SIZE squares
  const BOX = 20;                           // MNIST digits fit in a 20 x 20 box in the middle
  const BRUSH = 1.25;                       // brush radius, in squares
  const MODEL_URL = 'assets/models/digit-mlp.json';
  const { t } = window.I18N || { t: (s, vars) => (vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s) };

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (value == null || value === false) continue;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else node.setAttribute(key, value);
    }
    for (const child of children) if (child != null) node.append(child);
    return node;
  }

  // ---------- The model: loaded once, shared by every copy of the simulation ----------
  let modelPromise = null;

  function fromBase64(text) {
    const bytes = atob(text);
    const out = new Int8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) out[i] = (bytes.charCodeAt(i) << 24) >> 24; // as signed bytes
    return out;
  }

  function loadModel() {
    modelPromise = modelPromise || fetch(MODEL_URL)
      .then((r) => { if (!r.ok) throw new Error(`${MODEL_URL}: ${r.status}`); return r.json(); })
      .then((m) => ({
        ...m,
        W1: Float32Array.from(fromBase64(m.W1), (w) => w * m.W1scale),
        W2: Float32Array.from(fromBase64(m.W2), (w) => w * m.W2scale),
      }))
      .catch((err) => { modelPromise = null; throw err; });
    return modelPromise;
  }

  // 784 inputs -> hidden (ReLU) -> 10 chances (softmax) that add up to 1.
  function predict(m, input) {
    const hidden = new Float32Array(m.hidden);
    for (let j = 0; j < m.hidden; j++) hidden[j] = m.b1[j];
    for (let i = 0; i < m.inputs; i++) {
      const x = input[i];
      if (!x) continue;
      const row = i * m.hidden;
      for (let j = 0; j < m.hidden; j++) hidden[j] += x * m.W1[row + j];
    }
    const scores = m.b2.slice();
    for (let j = 0; j < m.hidden; j++) {
      const h = Math.max(0, hidden[j]);
      if (!h) continue;
      for (let k = 0; k < m.outputs; k++) scores[k] += h * m.W2[j * m.outputs + k];
    }
    const top = Math.max(...scores);
    const exps = scores.map((s) => Math.exp(s - top));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / sum);
  }

  // ---------- Preparing the drawing like an MNIST digit ----------
  function sample(img, w, h, x, y) { // bilinear, 0 outside the picture
    const x0 = Math.floor(x), y0 = Math.floor(y);
    let v = 0;
    for (const [dx, wx] of [[0, 1 - (x - x0)], [1, x - x0]]) {
      for (const [dy, wy] of [[0, 1 - (y - y0)], [1, y - y0]]) {
        const xi = x0 + dx, yi = y0 + dy;
        if (xi >= 0 && xi < w && yi >= 0 && yi < h) v += img[yi * w + xi] * wx * wy;
      }
    }
    return v;
  }

  function prepare(ink) {
    let left = SIZE, right = -1, top = SIZE, bottom = -1;
    for (let i = 0; i < ink.length; i++) {
      if (ink[i] < 0.05) continue;
      const r = Math.floor(i / SIZE), c = i % SIZE;
      left = Math.min(left, c); right = Math.max(right, c);
      top = Math.min(top, r); bottom = Math.max(bottom, r);
    }
    if (right < 0) return null; // nothing drawn

    // 1. Crop to the ink and scale it so its longer side is 20 squares.
    const bw = right - left + 1, bh = bottom - top + 1;
    const scale = BOX / Math.max(bw, bh);
    const w = Math.max(1, Math.round(bw * scale)), h = Math.max(1, Math.round(bh * scale));
    const small = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        small[y * w + x] = Math.min(1, sample(ink, SIZE, SIZE, left + (x + 0.5) / scale - 0.5, top + (y + 0.5) / scale - 0.5));
      }
    }
    // 2. Put it in a 28 x 28 picture with its centre of mass in the middle.
    let mass = 0, mx = 0, my = 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const v = small[y * w + x]; mass += v; mx += v * x; my += v * y; }
    const dx = Math.round(SIZE / 2 - 0.5 - mx / mass), dy = Math.round(SIZE / 2 - 0.5 - my / mass);
    const out = new Float32Array(SIZE * SIZE);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const r = y + dy, c = x + dx;
        if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) out[r * SIZE + c] = small[y * w + x];
      }
    }
    return out;
  }

  // ---------- Painting a 28 x 28 picture on a canvas ----------
  // The canvas is sized to the screen's pixels, so the squares and grid lines stay sharp.
  function paint(canvas, pixels, gridLines) {
    const ctx = canvas.getContext('2d');
    const style = getComputedStyle(canvas);
    const shown = canvas.clientWidth;
    if (shown) {
      const size = Math.round(shown * (window.devicePixelRatio || 1));
      if (canvas.width !== size) canvas.width = canvas.height = size;
    }
    const edge = (k) => Math.round(k * canvas.width / SIZE); // where square k starts
    ctx.fillStyle = style.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = style.color;
    if (pixels) {
      for (let i = 0; i < pixels.length; i++) {
        if (pixels[i] <= 0.01) continue;
        const r = Math.floor(i / SIZE), c = i % SIZE;
        ctx.globalAlpha = Math.min(1, pixels[i]);
        ctx.fillRect(edge(c), edge(r), edge(c + 1) - edge(c), edge(r + 1) - edge(r));
      }
    }
    if (gridLines) {
      ctx.globalAlpha = 0.1;
      const line = Math.max(1, Math.round(window.devicePixelRatio || 1));
      for (let k = 1; k < SIZE; k++) {
        ctx.fillRect(edge(k), 0, line, canvas.height);
        ctx.fillRect(0, edge(k), canvas.width, line);
      }
    }
    ctx.globalAlpha = 1;
  }

  function create() {
    const ink = new Float32Array(SIZE * SIZE); // 0 = empty, 1 = full ink
    let erasing = false;
    let model = null;
    let frame = 0;

    const pad = el('canvas', { class: 'digit-pad', width: String(SIZE * 20), height: String(SIZE * 20),
      role: 'img', 'aria-label': t('Drawing grid, 28 by 28. Draw a digit with the mouse or a finger.') });
    const seen = el('canvas', { class: 'digit-seen', width: String(SIZE * 4), height: String(SIZE * 4),
      role: 'img', 'aria-label': t('What the model sees') });
    const guess = el('span', { class: 'digit-guess-digit', text: '?' });
    const guessNote = el('span', { class: 'digit-guess-note' });
    const status = el('p', { class: 'sim-status', role: 'status' });
    const bars = [];
    const chart = el('ol', { class: 'digit-bars', 'aria-label': t('How sure the model is about each digit') });
    for (let d = 0; d < 10; d++) {
      const fill = el('span', { class: 'digit-bar-fill' });
      const pct = el('span', { class: 'digit-bar-pct', text: '0%' });
      const row = el('li', { class: 'digit-bar' }, el('span', { class: 'digit-bar-label', text: String(d) }),
        el('span', { class: 'digit-bar-track' }, fill), pct);
      bars.push({ row, fill, pct });
      chart.append(row);
    }

    const drawBtn = el('button', { type: 'button', 'aria-pressed': 'true', text: t('✎ Draw') });
    const eraseBtn = el('button', { type: 'button', 'aria-pressed': 'false', text: t('⌫ Erase') });
    const clearBtn = el('button', { type: 'button', class: 'btn sim-play', text: t('Clear') });
    const setErasing = (on) => {
      erasing = on;
      drawBtn.setAttribute('aria-pressed', String(!on));
      eraseBtn.setAttribute('aria-pressed', String(on));
    };
    drawBtn.addEventListener('click', () => setErasing(false));
    eraseBtn.addEventListener('click', () => setErasing(true));
    clearBtn.addEventListener('click', () => { ink.fill(0); setErasing(false); update(); });

    const node = el('div', { class: 'sim digit-sim' },
      el('div', { class: 'sim-stage' },
        el('div', { class: 'digit-pad-wrap' },
          pad,
          el('div', { class: 'sim-actions' }, clearBtn,
            el('div', { class: 'sim-seg', role: 'group', 'aria-label': t('Pen') }, drawBtn, eraseBtn))),
        el('div', { class: 'sim-side' },
          el('div', { class: 'digit-guess' },
            el('span', { class: 'sim-label', text: t('The model says') }), guess, guessNote),
          status,
          chart,
          el('div', { class: 'digit-seen-wrap' }, seen,
            el('p', { class: 'muted', text: t('What the model sees: your drawing cropped, scaled to fit 20 x 20 and centred, like the 60,000 MNIST digits it learned from. Each of the 784 squares is one input, from 0 (empty) to 1 (full ink).') })),
        ),
      ),
    );

    // ---------- Showing the guess ----------
    function update() {
      frame = 0;
      paint(pad, ink, true);
      const input = prepare(ink);
      paint(seen, input, false);
      let chances = null;
      if (!input) status.textContent = t('Draw a digit from 0 to 9 on the grid.');
      else if (!model) status.textContent = t('Loading the model…');
      else {
        chances = predict(model, input);
        status.textContent = t('Keep drawing or erase, and watch the chances change.');
      }
      const best = chances ? chances.indexOf(Math.max(...chances)) : -1;
      guess.textContent = best < 0 ? '?' : String(best);
      guessNote.textContent = best < 0 ? '' : t('{p}% sure', { p: Math.round(chances[best] * 100) });
      bars.forEach((b, d) => {
        const p = chances ? chances[d] : 0;
        b.fill.style.width = `${(p * 100).toFixed(1)}%`;
        b.pct.textContent = `${Math.round(p * 100)}%`;
        b.row.classList.toggle('is-best', d === best);
      });
    }
    const later = () => { if (!frame) frame = requestAnimationFrame(update); };

    // ---------- Drawing with the mouse or a finger ----------
    function dab(x, y) { // x, y in squares
      for (let r = Math.floor(y - BRUSH - 1); r <= Math.ceil(y + BRUSH + 1); r++) {
        for (let c = Math.floor(x - BRUSH - 1); c <= Math.ceil(x + BRUSH + 1); c++) {
          if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) continue;
          const d = Math.hypot(c + 0.5 - x, r + 0.5 - y);
          const v = Math.max(0, Math.min(1, BRUSH + 0.5 - d)); // full inside the brush, soft at its edge
          const i = r * SIZE + c;
          ink[i] = erasing ? Math.min(ink[i], 1 - v) : Math.max(ink[i], v);
        }
      }
    }

    let last = null;
    const point = (e) => {
      const box = pad.getBoundingClientRect();
      return [(e.clientX - box.left) / box.width * SIZE, (e.clientY - box.top) / box.height * SIZE];
    };
    function strokeTo(p) {
      const [x0, y0] = last || p;
      const steps = Math.max(1, Math.ceil(Math.hypot(p[0] - x0, p[1] - y0) / 0.25));
      for (let s = 1; s <= steps; s++) dab(x0 + (p[0] - x0) * s / steps, y0 + (p[1] - y0) * s / steps);
      last = p;
      later();
    }
    pad.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      e.preventDefault();
      pad.setPointerCapture(e.pointerId);
      last = null;
      strokeTo(point(e));
      if (!model) loadModel().then((m) => { model = m; later(); }, showError);
    });
    pad.addEventListener('pointermove', (e) => { if (last) strokeTo(point(e)); });
    const stop = () => { last = null; };
    pad.addEventListener('pointerup', stop);
    pad.addEventListener('pointercancel', stop);

    function showError() {
      status.textContent = t('The model could not load. Refresh the page to try again.');
    }

    // Start with a sample digit so the guess shows right away.
    [[[9, 7], [13, 5], [18, 6], [19, 10], [17, 14], [12, 18], [8, 22], [14, 22], [20, 22]]]
      .forEach((stroke) => { last = null; stroke.forEach((p) => strokeTo(p)); last = null; });
    loadModel().then((m) => { model = m; later(); }, showError);
    update();
    // Colour schemes change the canvas colours, so repaint when the theme changes.
    new MutationObserver(later).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    // Repaint at the new size when the canvas is resized, or first shown (an opened line).
    if (window.ResizeObserver) new ResizeObserver(later).observe(pad);

    return { node, pause() {} };
  }

  window.DigitSim = { create };
})();
