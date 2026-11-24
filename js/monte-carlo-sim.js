/*
 * Monte Carlo simulations, for "simulations" in topics.json:
 *   { "type": "mc-pi" }    estimating π by throwing random darts at a square with a circle inside;
 *   { "type": "mc-area" }  the area of any shape (a preset or one the student draws), by throwing
 *                          random points into the box around it.
 *
 * Both share one engine: a board (two canvases: the darts, and on top of them the outlines and
 * the dart that is landing), the throw buttons, the running numbers and a convergence graph with a
 * logarithmic x-axis. "Throw 1" animates a single dart and shows the arithmetic it changes;
 * "Throw 100" and "Throw 100,000" rain darts in over a few frames, so the page stays responsive.
 */
(() => {
  'use strict';

  const { t } = window.I18N || { t: (s, vars) => (vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s) };
  const reducedMotion = Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const CHUNK = 5000;          // darts thrown per frame in a big batch (100,000 takes 20 frames)
  const SMALL_CHUNK = 4;       // darts per frame when throwing 100, so you can watch them land
  const FLIGHT_MS = 320;       // how long a single dart takes to land
  const MAX_KEPT = 2000000;    // darts remembered for repainting the board (after that it is solid anyway)
  const SIZES = [4.5, 2.4, 0.8]; // dot radius in CSS pixels for: 1 dart, 100 darts, 100,000 darts

  const num = (n) => n.toLocaleString('en-US');
  const fix = (v, d) => v.toFixed(d).replace(/^-/, '−');
  const short = (n) => (n >= 1e6 ? `${n / 1e6}M` : n >= 1e3 ? `${n / 1e3}k` : String(n));

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (value == null || value === false) continue;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else node.setAttribute(key, value);
    }
    for (const child of children) if (child != null && child !== false) node.append(child);
    return node;
  }

  // Numbers and formulas read left to right, also on the Hebrew site.
  const math = (text, cls = '') => el('bdi', { dir: 'ltr', class: `mc-math ${cls}`.trim(), text });

  // The theme's colours, read from CSS so every colour scheme works.
  function palette(node) {
    const s = getComputedStyle(node);
    const v = (k, fallback) => s.getPropertyValue(k).trim() || fallback;
    const rgba = (k, fallback) => (a = 1) => `rgba(${v(k, fallback)}, ${a})`;
    return {
      bg: v('--bg', '#fff'), text: v('--text', '#222'), muted: v('--muted', '#666'), border: v('--border', '#ccc'),
      font: v('--font-mono', 'monospace'),
      t: rgba('--t', '190, 24, 120'), ok: rgba('--ok', '21, 128, 61'), bad: rgba('--bad', '190, 40, 40'),
    };
  }

  // Size a canvas to the screen's pixels so lines and dots stay sharp. True if it changed.
  function fit(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width === w && canvas.height === h) return false;
    canvas.width = w;
    canvas.height = h;
    return true;
  }

  // ---------- The shared engine ----------
  // spec: {
  //   view: { x0, y0, x1, y1 }         the part of the plane the board shows (y goes up)
  //   box(): { x0, y0, x1, y1 }        where darts land
  //   inside(x, y): boolean            is a dart a hit?
  //   estimate(hits, total): number
  //   target(): number | null          the real value, when there is one
  //   range(target, estimate): [lo, hi]  the graph's y-axis
  //   ready(): boolean                 can darts be thrown now?
  //   backdrop(ctx, map, colors)       painted under the darts
  //   outline(ctx, map, colors)        painted over the darts
  //   explain(state): [nodes]          the arithmetic under the buttons
  //   insideLabel, boardLabel, about, code, controls, cls
  // }
  function engine(spec) {
    let kept = { x: new Float32Array(1 << 14), y: new Float32Array(1 << 14), f: new Uint8Array(1 << 14), n: 0 };
    const scratch = { x: new Float32Array(CHUNK), y: new Float32Array(CHUNK), f: new Uint8Array(CHUNK) };
    let hits = 0;
    let total = 0;
    let history = [];      // [darts, estimate] pairs for the graph
    let nextMark = 1;
    let last = null;       // the latest dart: { x, y, hit, size }
    let flight = null;     // a single dart that is landing: { x, y, start }
    let pending = 0;       // darts still to throw in this batch
    let size = 0;          // the dot size of this batch (index into SIZES)
    let frame = 0;
    let colors = null;

    const base = el('canvas', { class: 'mc-layer' });
    const top = el('canvas', { class: 'mc-layer mc-top' });
    const board = el('div', { class: 'mc-board', role: 'img', 'aria-label': spec.boardLabel }, base, top);
    const chart = el('canvas', { class: 'mc-chart', role: 'img', 'aria-label': t('Graph of the estimate as more darts are thrown') });

    const throwBtns = [
      el('button', { type: 'button', class: 'btn sim-play', text: t('🎯 Throw 1') }),
      el('button', { type: 'button', class: 'sim-btn', text: t('Throw 100') }),
      el('button', { type: 'button', class: 'sim-btn', text: t('Throw 100,000') }),
    ];
    const resetBtn = el('button', { type: 'button', class: 'sim-btn', text: t('Reset') });
    const counts = el('p', { class: 'mc-counts' });
    const explain = el('div', { class: 'mc-explain', role: 'status' });

    const node = el('div', { class: `sim mc-sim ${spec.cls || ''}`.trim() },
      spec.controls || null,
      el('p', { class: 'sim-about', text: spec.about }),
      el('div', { class: 'sim-stage' },
        el('div', { class: 'mc-board-wrap' }, board),
        el('div', { class: 'sim-side' },
          el('div', { class: 'sim-actions' }, ...throwBtns, resetBtn),
          counts,
          explain,
          el('figure', { class: 'mc-graph' },
            chart,
            el('figcaption', { class: 'muted', text: t('The estimate after each dart. Each step to the right is 10 times more darts; the dashed line is the real value.') })),
        ),
      ),
      el('p', { class: 'muted mc-note', text: t('Notice: 10 times more darts makes the error only about 3 times smaller (√10 ≈ 3.16). That is why Monte Carlo needs so many tries, and why it needs a computer.') }),
      spec.code ? el('details', { class: 'mc-code' },
        el('summary', { text: t('The same idea in Python') }),
        el('pre', { dir: 'ltr' }, el('code', { text: spec.code }))) : null,
    );

    // ---------- From the plane to the board's pixels ----------
    const V = spec.view;
    const map = {
      px: (x) => (x - V.x0) / (V.x1 - V.x0) * base.width,
      py: (y) => (V.y1 - y) / (V.y1 - V.y0) * base.height,
      x: (px) => V.x0 + px / base.clientWidth * (V.x1 - V.x0),   // CSS pixels -> plane
      y: (py) => V.y1 - py / base.clientHeight * (V.y1 - V.y0),
      get dpr() { return window.devicePixelRatio || 1; },
    };

    // ---------- Darts ----------
    function keep(x, y, f) {
      if (kept.n >= MAX_KEPT) return;
      if (kept.n === kept.x.length) {
        const grow = (a) => { const b = new a.constructor(a.length * 2); b.set(a); return b; };
        kept = { x: grow(kept.x), y: grow(kept.y), f: grow(kept.f), n: kept.n };
      }
      kept.x[kept.n] = x;
      kept.y[kept.n] = y;
      kept.f[kept.n] = f;
      kept.n++;
    }

    // Hits in green and misses in red, each colour as one path (fast even for 100,000 dots).
    function dots(ctx, xs, ys, fs, from, to) {
      const dpr = map.dpr;
      for (const hit of [1, 0]) {
        ctx.fillStyle = hit ? colors.ok(0.85) : colors.bad(0.85);
        ctx.beginPath();
        for (let i = from; i < to; i++) {
          if ((fs[i] & 1) !== hit) continue;
          const X = map.px(xs[i]);
          const Y = map.py(ys[i]);
          const s = fs[i] >> 1;
          if (s === 2) {
            const w = Math.max(1, SIZES[2] * 2 * dpr);
            ctx.rect(X - w / 2, Y - w / 2, w, w);
          } else {
            const r = SIZES[s] * dpr;
            ctx.moveTo(X + r, Y);
            ctx.arc(X, Y, r, 0, Math.PI * 2);
          }
        }
        ctx.fill();
      }
    }

    function mark(force) {
      if (!force && total >= 100 && total < nextMark) return;
      const point = [total, spec.estimate(hits, total)];
      if (history.length && history[history.length - 1][0] === total) history[history.length - 1] = point;
      else history.push(point);
      nextMark = total * 1.01;
    }

    // Throw `count` darts (at most CHUNK) of dot size `s`; `at` is a dart already picked (a single throw).
    function throwSome(count, s, at) {
      const box = spec.box();
      const m = Math.min(count, CHUNK);
      for (let i = 0; i < m; i++) {
        const x = at ? at.x : box.x0 + Math.random() * (box.x1 - box.x0);
        const y = at ? at.y : box.y0 + Math.random() * (box.y1 - box.y0);
        const hit = spec.inside(x, y) ? 1 : 0;
        const f = hit | (s << 1);
        scratch.x[i] = x;
        scratch.y[i] = y;
        scratch.f[i] = f;
        keep(x, y, f);
        hits += hit;
        total++;
        mark(false);
      }
      last = { x: scratch.x[m - 1], y: scratch.y[m - 1], hit: Boolean(scratch.f[m - 1] & 1), size: s };
      mark(true);
      dots(base.getContext('2d'), scratch.x, scratch.y, scratch.f, 0, m);
      return m;
    }

    function busy() { return Boolean(flight || pending > 0); }

    function start(n) {
      if (busy() || !spec.ready()) return;
      if (!colors) colors = palette(node);
      if (n === 1) {
        const box = spec.box();
        const at = { x: box.x0 + Math.random() * (box.x1 - box.x0), y: box.y0 + Math.random() * (box.y1 - box.y0) };
        if (reducedMotion) throwSome(1, 0, at);
        else flight = { ...at, start: performance.now() };
      } else {
        pending = n;
        size = n <= 100 ? 1 : 2;
      }
      loop();
    }

    function loop() {
      frame = 0;
      if (flight) {
        if (performance.now() - flight.start >= FLIGHT_MS) {
          const at = flight;
          flight = null;
          throwSome(1, 0, at);
        }
      } else if (pending > 0) {
        pending -= throwSome(Math.min(pending, size === 1 ? SMALL_CHUNK : CHUNK), size);
      }
      drawTop();
      drawChart();
      text();
      if (busy() && node.isConnected) frame = requestAnimationFrame(loop);
      else finish();
    }

    // Throw whatever is left at once (the page moved on, or the simulation was closed).
    function finish() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (flight) { const at = flight; flight = null; throwSome(1, 0, at); }
      while (pending > 0) pending -= throwSome(pending, size);
      drawTop();
      drawChart();
      text();
    }

    function reset() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      flight = null;
      pending = 0;
      hits = 0;
      total = 0;
      history = [];
      nextMark = 1;
      last = null;
      kept.n = 0;
      repaint();
    }

    // ---------- Painting ----------
    function repaint() {
      colors = palette(node);
      fit(base);
      const ctx = base.getContext('2d');
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, base.width, base.height);
      spec.backdrop(ctx, map, colors);
      dots(ctx, kept.x, kept.y, kept.f, 0, kept.n);
      drawTop();
      drawChart();
      text();
    }

    function drawTop() {
      if (!colors) colors = palette(node);
      if (top.width !== base.width || top.height !== base.height) { top.width = base.width; top.height = base.height; }
      const ctx = top.getContext('2d');
      const dpr = map.dpr;
      ctx.clearRect(0, 0, top.width, top.height);
      spec.outline(ctx, map, colors);
      if (last && last.size === 0 && !flight) { // ring the dart that just landed
        ctx.strokeStyle = colors.t(1);
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.arc(map.px(last.x), map.py(last.y), 10 * dpr, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (flight) { // the dart falls onto the board: a shrinking, darkening circle
        const p = Math.min(1, (performance.now() - flight.start) / FLIGHT_MS);
        const X = map.px(flight.x);
        const Y = map.py(flight.y);
        ctx.globalAlpha = 0.25 + 0.75 * p;
        ctx.fillStyle = colors.t(0.25);
        ctx.strokeStyle = colors.t(1);
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.arc(X, Y, (SIZES[0] + 26 * (1 - p) * (1 - p)) * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    function drawChart() {
      if (!colors) colors = palette(node);
      fit(chart);
      const ctx = chart.getContext('2d');
      const dpr = map.dpr;
      const W = chart.width;
      const H = chart.height;
      const L = 46 * dpr, R = 12 * dpr, T = 10 * dpr, B = 22 * dpr;
      ctx.clearRect(0, 0, W, H);
      ctx.font = `${11 * dpr}px ${colors.font}`;
      ctx.direction = 'ltr';

      const target = spec.target();
      const est = total ? spec.estimate(hits, total) : null;
      const [lo, hi] = spec.range(target, est);
      const decades = Math.max(2, Math.ceil(Math.log10(Math.max(total, 1)) - 1e-9));
      const X = (n) => L + Math.log10(n) / decades * (W - L - R);
      const Y = (v) => T + (hi - Math.min(hi, Math.max(lo, v))) / (hi - lo) * (H - T - B);

      // axes and decade lines
      ctx.strokeStyle = colors.border;
      ctx.fillStyle = colors.muted;
      ctx.lineWidth = dpr;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      for (let d = 0; d <= decades; d++) {
        const x = Math.round(X(10 ** d)) + 0.5;
        ctx.beginPath();
        ctx.moveTo(x, T);
        ctx.lineTo(x, H - B);
        ctx.stroke();
        ctx.fillText(short(10 ** d), x, H - B + 5 * dpr);
      }
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const digits = spec.digits || 2;
      const ticks = target == null ? [lo, (lo + hi) / 2, hi] : [lo, target, hi];
      for (const v of ticks) ctx.fillText(fix(v, digits), L - 6 * dpr, Y(v));
      ctx.strokeRect(L, T, W - L - R, H - T - B);

      if (target != null) {
        ctx.strokeStyle = colors.text;
        ctx.globalAlpha = 0.7;
        ctx.setLineDash([6 * dpr, 4 * dpr]);
        ctx.beginPath();
        ctx.moveTo(L, Y(target));
        ctx.lineTo(W - R, Y(target));
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }

      if (!history.length) {
        ctx.textAlign = 'center';
        ctx.fillStyle = colors.muted;
        ctx.fillText(t('No darts yet'), (L + W - R) / 2, (T + H - B) / 2 - 12 * dpr);
        return;
      }
      ctx.save();
      ctx.beginPath();
      ctx.rect(L, T - 4 * dpr, W - L - R, H - T - B + 8 * dpr);
      ctx.clip();
      ctx.strokeStyle = colors.t(1);
      ctx.lineWidth = 2 * dpr;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      history.forEach(([n, v], i) => (i ? ctx.lineTo(X(n), Y(v)) : ctx.moveTo(X(n), Y(v))));
      ctx.stroke();
      const [n, v] = history[history.length - 1];
      ctx.fillStyle = colors.t(1);
      ctx.beginPath();
      ctx.arc(X(n), Y(v), 3.5 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function text() {
      const swatch = (kind) => el('span', { class: `mc-swatch is-${kind}`, 'aria-hidden': 'true' });
      counts.replaceChildren(
        el('span', {}, swatch('hit'), `${spec.insideLabel} `, el('b', { text: num(hits) })),
        el('span', {}, swatch('miss'), `${t('Outside')} `, el('b', { text: num(total - hits) })),
        el('span', {}, `${t('Total')} `, el('b', { text: num(total) })),
      );
      explain.replaceChildren(...spec.explain({ hits, total, last, estimate: total ? spec.estimate(hits, total) : null }));
      const ready = spec.ready();
      throwBtns.forEach((b) => { b.disabled = busy() || !ready; });
    }

    throwBtns[0].addEventListener('click', () => start(1));
    throwBtns[1].addEventListener('click', () => start(100));
    throwBtns[2].addEventListener('click', () => start(100000));
    resetBtn.addEventListener('click', reset);

    // Repaint at the new size when the board is resized or first shown, and when the colours change.
    let queued = 0;
    const later = () => { if (!queued) queued = requestAnimationFrame(() => { queued = 0; repaint(); }); };
    new MutationObserver(later).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (window.ResizeObserver) new ResizeObserver(later).observe(board);
    repaint();

    return { node, board, top: () => drawTop(), text, reset, busy, map, pause: finish };
  }

  // ---------- 1. Estimating π ----------
  function createPi() {
    const sim = engine({
      cls: 'mc-pi',
      view: { x0: -1.04, y0: -1.04, x1: 1.04, y1: 1.04 },
      box: () => ({ x0: -1, y0: -1, x1: 1, y1: 1 }),
      inside: (x, y) => x * x + y * y <= 1,
      estimate: (h, n) => 4 * h / n,
      target: () => Math.PI,
      range: () => [Math.PI - 0.6, Math.PI + 0.6],
      digits: 2,
      ready: () => true,
      insideLabel: t('Inside the circle'),
      boardLabel: t('Dart board: a square from −1 to 1 with a circle of radius 1 inside it'),
      about: t('The square goes from −1 to 1, so its area is 2 × 2 = 4. The circle has radius 1, so its area is π × 1² = π. A random dart lands in the circle with a chance of π / 4, so π ≈ 4 × (darts inside) / (all darts).'),
      backdrop(ctx, map, c) {
        ctx.fillStyle = c.t(0.07);
        ctx.beginPath();
        ctx.arc(map.px(0), map.py(0), map.px(1) - map.px(0), 0, Math.PI * 2);
        ctx.fill();
      },
      outline(ctx, map, c) {
        ctx.strokeStyle = c.text;
        ctx.lineWidth = 1.5 * map.dpr;
        ctx.strokeRect(map.px(-1), map.py(1), map.px(1) - map.px(-1), map.py(-1) - map.py(1));
        ctx.beginPath();
        ctx.arc(map.px(0), map.py(0), map.px(1) - map.px(0), 0, Math.PI * 2);
        ctx.stroke();
      },
      explain({ hits, total, last, estimate }) {
        if (!total) return [el('p', { class: 'mc-line', text: t('Throw a dart to start.') })];
        const off = Math.abs(estimate - Math.PI);
        const lines = [
          el('p', { class: 'mc-line' }, math(`π ≈ 4 × ${num(hits)} / ${num(total)} = ${estimate.toFixed(4)}`, 'mc-big')),
          el('p', { class: 'mc-line' }, t('The real π is {pi} · off by {d}', { pi: '3.14159…', d: off.toFixed(4) })),
        ];
        if (last) {
          const d2 = last.x * last.x + last.y * last.y;
          lines.push(el('p', { class: 'mc-line' }, `${t('Last dart:')} `,
            math(`x = ${fix(last.x, 2)}, y = ${fix(last.y, 2)} → x² + y² = ${d2.toFixed(2)} ${d2 <= 1 ? '≤' : '>'} 1`),
            ' ', el('span', { class: last.hit ? 'is-hit' : 'is-miss', text: last.hit ? t('inside ✓') : t('outside ✗') })));
        }
        return lines;
      },
      code: [
        'import random',
        '',
        'total = 100_000',
        'hits = 0',
        'for _ in range(total):',
        '    x = random.uniform(-1, 1)',
        '    y = random.uniform(-1, 1)',
        '    if x**2 + y**2 <= 1:      # inside the circle',
        '        hits += 1',
        '',
        'print(4 * hits / total)      # about 3.14',
      ].join('\n'),
    });
    return sim;
  }

  // ---------- 2. The area of any shape ----------
  const SIDE = 10; // the board is 10 x 10 squares

  function polygon(xs, ys) {
    const n = xs.length;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, twice = 0;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      x0 = Math.min(x0, xs[i]); x1 = Math.max(x1, xs[i]);
      y0 = Math.min(y0, ys[i]); y1 = Math.max(y1, ys[i]);
      twice += xs[j] * ys[i] - xs[i] * ys[j]; // the shoelace formula
    }
    return { xs: Float64Array.from(xs), ys: Float64Array.from(ys), box: { x0, y0, x1, y1 }, area: Math.abs(twice) / 2, simple: isSimple(xs, ys) };
  }

  // Inside, by the even-odd rule: a ray to the right crosses the outline an odd number of times.
  function insidePolygon(p, x, y) {
    const { xs, ys } = p;
    let inside = false;
    for (let i = 0, j = xs.length - 1; i < xs.length; j = i++) {
      if ((ys[i] > y) !== (ys[j] > y) && x < (xs[j] - xs[i]) * (y - ys[i]) / (ys[j] - ys[i]) + xs[i]) inside = !inside;
    }
    return inside;
  }

  // Does the outline cross itself? Then the shoelace formula no longer gives the area.
  function isSimple(xs, ys) {
    const n = xs.length;
    const turn = (ax, ay, bx, by, cx, cy) => Math.sign((bx - ax) * (cy - ay) - (by - ay) * (cx - ax));
    for (let i = 0; i < n; i++) {
      const i2 = (i + 1) % n;
      for (let j = i + 2; j < n; j++) {
        const j2 = (j + 1) % n;
        if (j2 === i) continue; // neighbours share a corner
        // the two segments' boxes overlap, and each one's ends are on both sides of (or touching) the other
        if (Math.max(xs[i], xs[i2]) >= Math.min(xs[j], xs[j2]) && Math.max(xs[j], xs[j2]) >= Math.min(xs[i], xs[i2])
          && Math.max(ys[i], ys[i2]) >= Math.min(ys[j], ys[j2]) && Math.max(ys[j], ys[j2]) >= Math.min(ys[i], ys[i2])
          && turn(xs[i], ys[i], xs[i2], ys[i2], xs[j], ys[j]) * turn(xs[i], ys[i], xs[i2], ys[i2], xs[j2], ys[j2]) <= 0
          && turn(xs[j], ys[j], xs[j2], ys[j2], xs[i], ys[i]) * turn(xs[j], ys[j], xs[j2], ys[j2], xs[i2], ys[i2]) <= 0) return false;
      }
    }
    return true;
  }

  const SHAPES = {
    heart() {
      const xs = [], ys = [];
      for (let k = 0; k < 240; k++) {
        const a = k / 240 * Math.PI * 2;
        xs.push(5 + 0.25 * 16 * Math.sin(a) ** 3);
        ys.push(5.6 + 0.25 * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)));
      }
      return polygon(xs, ys);
    },
    star() {
      const xs = [], ys = [];
      for (let k = 0; k < 10; k++) {
        const a = Math.PI / 2 + k * Math.PI / 5;
        const r = k % 2 ? 1.8 : 4.4;
        xs.push(5 + r * Math.cos(a));
        ys.push(4.7 + r * Math.sin(a));
      }
      return polygon(xs, ys);
    },
    blob() { // a new random lake every time
      const waves = [2, 3, 4, 5].map((k) => ({ k, a: Math.random() * 0.7 / (k - 1) * 2, p: Math.random() * Math.PI * 2 }));
      const xs = [], ys = [];
      for (let k = 0; k < 180; k++) {
        const a = k / 180 * Math.PI * 2;
        const r = 3 + waves.reduce((s, w) => s + w.a * Math.sin(w.k * a + w.p), 0);
        xs.push(5 + r * Math.cos(a));
        ys.push(5 + r * Math.sin(a));
      }
      return polygon(xs, ys);
    },
  };

  function createArea() {
    let shape = SHAPES.heart();
    let drawing = null; // the outline being drawn: { xs, ys } (null when not drawing)
    let message = '';
    let sim = null;

    const picks = {
      heart: t('♥ Heart'),
      star: t('★ Star'),
      blob: t('◍ Random lake'),
      draw: t('✎ Draw your own'),
    };
    const buttons = new Map();
    const seg = el('div', { class: 'sim-seg', role: 'group', 'aria-label': t('Shape') });
    for (const [id, label] of Object.entries(picks)) {
      const b = el('button', { type: 'button', 'aria-pressed': String(id === 'heart'), text: label });
      b.addEventListener('click', () => choose(id));
      buttons.set(id, b);
      seg.append(b);
    }
    const controls = el('div', { class: 'sim-controls' },
      el('div', { class: 'sim-row' }, el('span', { class: 'sim-label', text: t('Shape') }), seg));

    function choose(id) {
      for (const [other, b] of buttons) b.setAttribute('aria-pressed', String(other === id));
      message = '';
      if (id === 'draw') {
        shape = null;
        drawing = { xs: [], ys: [] };
      } else {
        drawing = null;
        shape = SHAPES[id]();
      }
      sim.board.classList.toggle('is-drawing', Boolean(drawing));
      sim.reset();
    }

    const box = () => shape.box;
    const path = (ctx, map, xs, ys, close) => {
      ctx.beginPath();
      xs.forEach((x, i) => (i ? ctx.lineTo(map.px(x), map.py(ys[i])) : ctx.moveTo(map.px(x), map.py(ys[i]))));
      if (close) ctx.closePath();
    };
    const boxArea = () => (shape.box.x1 - shape.box.x0) * (shape.box.y1 - shape.box.y0);

    sim = engine({
      cls: 'mc-area',
      controls,
      view: { x0: 0, y0: 0, x1: SIDE, y1: SIDE },
      box,
      inside: (x, y) => insidePolygon(shape, x, y),
      estimate: (h, n) => boxArea() * h / n,
      target: () => (shape && shape.simple ? shape.area : null),
      range: (target, est) => {
        const mid = target != null ? target : est != null ? est : 10;
        return [mid * 0.6, mid * 1.4];
      },
      digits: 1,
      ready: () => Boolean(shape),
      insideLabel: t('Inside the shape'),
      boardLabel: t('A 10 by 10 board with the shape and the box around it'),
      about: t('There is no formula for the area of a heart, or of a shape you draw by hand. But the box around it is easy: width × height. Throw random darts into the box. The part of them that lands inside the shape is about the part of the box the shape covers, so: area ≈ box area × (darts inside) / (all darts).'),
      backdrop(ctx, map, c) {
        ctx.strokeStyle = c.border;
        ctx.lineWidth = map.dpr;
        ctx.beginPath();
        for (let k = 1; k < SIDE; k++) { // faint 1 x 1 squares, to get a feeling for the area
          const x = Math.round(map.px(k)) + 0.5;
          const y = Math.round(map.py(k)) + 0.5;
          ctx.moveTo(x, 0); ctx.lineTo(x, map.py(0));
          ctx.moveTo(0, y); ctx.lineTo(map.px(SIDE), y);
        }
        ctx.stroke();
        if (!shape) return;
        ctx.fillStyle = c.t(0.08);
        path(ctx, map, shape.xs, shape.ys, true);
        ctx.fill('evenodd');
      },
      outline(ctx, map, c) {
        const dpr = map.dpr;
        if (shape) {
          const b = shape.box;
          ctx.strokeStyle = c.t(1);
          ctx.lineWidth = 1.5 * dpr;
          ctx.setLineDash([6 * dpr, 4 * dpr]);
          ctx.strokeRect(map.px(b.x0), map.py(b.y1), map.px(b.x1) - map.px(b.x0), map.py(b.y0) - map.py(b.y1));
          ctx.setLineDash([]);
          ctx.strokeStyle = c.text;
          ctx.lineWidth = 2 * dpr;
          ctx.lineJoin = 'round';
          path(ctx, map, shape.xs, shape.ys, true);
          ctx.stroke();
        }
        if (drawing && drawing.xs.length) {
          ctx.strokeStyle = c.t(1);
          ctx.lineWidth = 3 * dpr;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';
          path(ctx, map, drawing.xs, drawing.ys, false);
          ctx.stroke();
        }
      },
      explain({ hits, total, last, estimate }) {
        if (!shape) return [el('p', { class: 'mc-line mc-hint', text: message || t('Draw a closed shape on the board with the mouse or a finger. Let go to finish it.') })];
        const b = shape.box;
        const w = b.x1 - b.x0;
        const h = b.y1 - b.y0;
        const lines = [el('p', { class: 'mc-line' }, `${t('Box around the shape:')} `, math(`${w.toFixed(2)} × ${h.toFixed(2)} = ${(w * h).toFixed(2)}`))];
        if (total) {
          lines.push(el('p', { class: 'mc-line' }, `${t('Area ≈')} `, math(`${(w * h).toFixed(2)} × ${num(hits)} / ${num(total)} = ${estimate.toFixed(2)}`, 'mc-big')));
        } else {
          lines.push(el('p', { class: 'mc-line', text: t('Throw a dart to start.') }));
        }
        if (shape.simple) {
          lines.push(el('p', { class: 'mc-line' }, total
            ? t('Exact area (shoelace formula): {a} · off by {d}', { a: shape.area.toFixed(2), d: Math.abs(estimate - shape.area).toFixed(2) })
            : t('Exact area (shoelace formula): {a}', { a: shape.area.toFixed(2) })));
        } else {
          lines.push(el('p', { class: 'mc-line mc-hint', text: t('Your outline crosses itself, so there is no simple formula for its area. Monte Carlo doesn’t mind!') }));
        }
        if (last) {
          lines.push(el('p', { class: 'mc-line' }, `${t('Last dart:')} `, math(`(${last.x.toFixed(2)}, ${last.y.toFixed(2)})`),
            ' ', el('span', { class: last.hit ? 'is-hit' : 'is-miss', text: last.hit ? t('inside ✓') : t('outside ✗') })));
        }
        return lines;
      },
      code: [
        'import random',
        '',
        'def inside(x, y):',
        '    ...                       # True if (x, y) is inside the shape',
        '',
        'left, right, bottom, top = 1.0, 9.0, 1.5, 9.5     # the box around the shape',
        'box_area = (right - left) * (top - bottom)',
        '',
        'total = 100_000',
        'hits = 0',
        'for _ in range(total):',
        '    x = random.uniform(left, right)',
        '    y = random.uniform(bottom, top)',
        '    if inside(x, y):',
        '        hits += 1',
        '',
        'print(box_area * hits / total)',
      ].join('\n'),
    });

    // ---------- Drawing a shape with the mouse or a finger ----------
    const board = sim.board;
    const at = (e) => {
      const r = board.getBoundingClientRect();
      const x = Math.min(SIDE, Math.max(0, sim.map.x(e.clientX - r.left)));
      const y = Math.min(SIDE, Math.max(0, sim.map.y(e.clientY - r.top)));
      return [x, y];
    };
    let pen = false;
    board.addEventListener('pointerdown', (e) => {
      if (!drawing || e.button > 0) return;
      e.preventDefault();
      board.setPointerCapture(e.pointerId);
      pen = true;
      const [x, y] = at(e);
      drawing = { xs: [x], ys: [y] };
      sim.top();
    });
    board.addEventListener('pointermove', (e) => {
      if (!pen) return;
      const [x, y] = at(e);
      const n = drawing.xs.length - 1;
      if (Math.hypot(x - drawing.xs[n], y - drawing.ys[n]) < 0.08) return;
      drawing.xs.push(x);
      drawing.ys.push(y);
      sim.top();
    });
    const lift = () => {
      if (!pen) return;
      pen = false;
      const drawn = drawing.xs.length >= 8 ? polygon(drawing.xs, drawing.ys) : null;
      if (drawn && drawn.box.x1 - drawn.box.x0 >= 0.8 && drawn.box.y1 - drawn.box.y0 >= 0.8) {
        shape = drawn;
        drawing = null;
        message = '';
      } else {
        drawing = { xs: [], ys: [] };
        message = t('That shape is too small. Try drawing a bigger one.');
      }
      board.classList.toggle('is-drawing', Boolean(drawing));
      sim.reset();
    };
    board.addEventListener('pointerup', lift);
    board.addEventListener('pointercancel', lift);

    return { node: sim.node, pause: sim.pause };
  }

  window.MonteCarloSim = { createPi, createArea };
})();
