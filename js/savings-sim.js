/*
 * "Will my savings last?", a risk simulation for "simulations" in topics.json ({ "type": "savings-risk" }).
 * Students set the starting savings, the money taken out each year, the number of years, the
 * average yearly return and how much the return jumps around (volatility). Each run is one
 * possible future: every year the withdrawal comes out first, then the rest grows or shrinks by
 * a random return drawn from a normal (bell-shaped) distribution. Many runs fan out into a
 * picture of risk, and the share of futures where the money ran out is the answer.
 * The dashed line is the same plan with exactly the average return every year, to show that
 * planning with the average hides the risk.
 * Amounts are "today's money": the returns are meant after inflation.
 */
(() => {
  'use strict';

  const MAX_RUNS = 50000;     // stop here, to keep memory small
  const MAX_LINES = 400;      // how many futures are drawn as lines (the latest ones)
  const FRAMES = 25;          // a batch of runs is spread over this many frames
  const YEAR_MS = 70;         // "Run 1" draws one year every YEAR_MS
  const I18N = window.I18N || { lang: 'en', t: (s, vars) => (vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s) };
  const { t } = I18N;
  const plural = I18N.plural || ((n, one, many, vars) => t(n === 1 ? one : many, { n, ...vars }));
  const HE = I18N.lang === 'he';
  const SYMBOL = HE ? '₪' : '$';
  const LTR = (s) => `⁦${s}⁩`; // keeps "₪1.2M" and "-3.5%" in one piece inside Hebrew text

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

  // ---------- Numbers ----------
  function short(v) { // 1234567 -> "1.2M", 50000 -> "50K"
    const a = Math.abs(v);
    const trim = (x) => String(Number(x.toFixed(x < 10 ? 1 : 0)));
    if (a >= 1e6) return `${trim(v / 1e6)}M`;
    if (a >= 1e3) return `${trim(v / 1e3)}K`;
    return String(Math.round(v));
  }
  const money = (v) => `${SYMBOL}${short(v)}`;
  const moneyFull = (v) => `${SYMBOL}${Math.round(v).toLocaleString('en-US')}`;
  const pct = (p, digits = 0) => `${(p * 100).toFixed(digits)}%`;
  const signedPct = (p) => `${p >= 0 ? '+' : '−'}${Math.abs(p * 100).toFixed(1)}%`;

  // A random number from the bell curve with this average and spread (the Box-Muller trick).
  function normal(mean, sd) {
    const u = 1 - Math.random();
    const v = Math.random();
    return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  // One possible future: the balance at the start (year 0) and at the end of every year.
  // Returns { path, returns, ranOut } where ranOut is the year the money ran out, or 0.
  function future(p, returnFor) {
    const path = new Float64Array(p.years + 1);
    const returns = new Float64Array(p.years);
    let money = p.start;
    let ranOut = 0;
    path[0] = money;
    for (let y = 1; y <= p.years; y++) {
      const r = Math.max(-0.95, returnFor());
      returns[y - 1] = r;
      if (!ranOut) {
        money -= p.withdraw;                  // take out this year's money first
        if (money <= 0) { money = 0; ranOut = y; }
        else money *= 1 + r;                  // then the rest grows (or shrinks)
      }
      path[y] = money;
    }
    return { path, returns, ranOut };
  }

  const randomFuture = (p) => future(p, () => normal(p.mean, p.vol));
  const averageFuture = (p) => future(p, () => p.mean);

  function quantile(sorted, q) {
    if (!sorted.length) return 0;
    const i = (sorted.length - 1) * q;
    const lo = Math.floor(i);
    return sorted[lo] + (sorted[Math.min(lo + 1, sorted.length - 1)] - sorted[lo]) * (i - lo);
  }

  // A round step for the axis: 1, 2 or 5 times a power of ten, giving about `count` lines.
  function niceStep(max, count) {
    const raw = max / count;
    const pow = 10 ** Math.floor(Math.log10(raw));
    return [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw);
  }

  // ---------- Controls ----------
  const SLIDERS = [
    { id: 'start', label: t('Starting savings'), min: 100000, max: 3000000, step: 50000, value: 1000000, show: moneyFull },
    { id: 'withdraw', label: t('Taken out every year'), min: 10000, max: 300000, step: 5000, value: 50000, show: moneyFull },
    { id: 'years', label: t('Years'), min: 5, max: 50, step: 1, value: 30, show: String },
    { id: 'mean', label: t('Average yearly return'), min: -2, max: 12, step: 0.5, value: 6, show: (v) => `${v}%` },
    { id: 'vol', label: t('Ups and downs (volatility)'), min: 0, max: 40, step: 1, value: 15, show: (v) => `±${v}%` },
  ];

  function create() {
    const values = Object.fromEntries(SLIDERS.map((s) => [s.id, s.value]));
    const params = () => ({ ...values, mean: values.mean / 100, vol: values.vol / 100 });

    let p = params();
    let naive = averageFuture(p);
    let runs = [];           // every future so far: { path, returns, ranOut }
    let failed = 0;
    let bands = null;        // { low, mid, high } per year, from all the runs
    let yMax = 1;
    let job = null;          // the animation in progress: { kind, left, perFrame } or { kind: 'one', ... }
    let frame = 0;

    // ---------- The page ----------
    const inputs = {};
    const sliderRows = SLIDERS.map((s) => {
      const input = el('input', { type: 'range', min: String(s.min), max: String(s.max), step: String(s.step), value: String(s.value), 'aria-label': s.label });
      const out = el('output', { class: 'savings-value', text: s.show(s.value) });
      const note = el('span', { class: 'savings-note' });
      inputs[s.id] = { input, out, note, s };
      input.addEventListener('input', () => {
        values[s.id] = Number(input.value);
        out.textContent = s.show(values[s.id]);
        newPlan();
      });
      return el('label', { class: 'savings-slider' },
        el('span', { class: 'savings-slider-top' }, el('span', { class: 'savings-slider-label', text: s.label }), out, note),
        input);
    });

    const canvas = el('canvas', { class: 'savings-chart', width: '640', height: '360', role: 'img', 'aria-label': t('Chart of the money left in each simulated future, year by year') });
    const runBtns = [1, 100, 10000].map((n) => {
      const b = el('button', { type: 'button', class: n === 1 ? 'btn sim-play' : 'sim-btn', text: n === 1 ? t('▶ Run 1 future') : t('Run {n}', { n: n.toLocaleString('en-US') }) });
      b.addEventListener('click', () => start(n));
      return b;
    });
    const resetBtn = el('button', { type: 'button', class: 'sim-btn', text: t('Reset') });
    resetBtn.addEventListener('click', reset);

    const status = el('p', { class: 'sim-status', role: 'status' });
    const riskValue = el('span', { class: 'savings-risk-value', text: '?' });
    const riskNote = el('span', { class: 'savings-risk-note' });
    const facts = el('dl', { class: 'savings-facts' });

    const key = (cls, label) => el('li', {}, el('span', { class: `savings-key ${cls}`, 'aria-hidden': 'true' }), label);
    const node = el('div', { class: 'sim savings-sim' },
      el('div', { class: 'savings-sliders' }, ...sliderRows),
      el('p', { class: 'sim-about', text: t('Every year the money you need comes out first, then the rest grows or shrinks by a random return. The returns are after inflation, so all amounts are in today\'s money. Each run is one possible future.') }),
      el('div', { class: 'sim-stage' },
        el('div', { class: 'savings-chart-wrap' }, canvas,
          el('p', { class: 'savings-axis', text: t('Years from now →') })),
        el('div', { class: 'sim-side' },
          el('div', { class: 'sim-actions' }, ...runBtns, resetBtn),
          el('div', { class: 'savings-risk' }, el('span', { class: 'sim-label', text: t('Chance the money runs out') }), riskValue, riskNote),
          status,
          facts,
          el('ul', { class: 'sim-legend' },
            key('is-ok', t('a future where the money lasted')),
            key('is-out', t('a future where the money ran out')),
            key('is-last', t('the latest future')),
            key('is-band', t('the middle 80% of futures, and the median')),
            key('is-avg', t('the average return, every single year'))),
        ),
      ),
    );

    // ---------- Running ----------
    function addRun() {
      const run = randomFuture(p);
      runs.push(run);
      if (run.ranOut) failed++;
      return run;
    }

    function start(n) {
      stop();
      bands = null;
      n = Math.min(n, MAX_RUNS - runs.length);
      if (n <= 0) return draw();
      if (n === 1) {
        const run = addRun();
        job = { kind: 'one', run, shown: 0, last: 0 };
      } else {
        job = { kind: 'many', left: n, perFrame: Math.ceil(n / FRAMES) };
      }
      frame = requestAnimationFrame(tick);
      draw();
    }

    function tick(now) {
      frame = 0;
      if (!job) return;
      if (!node.isConnected) { stop(); return; } // the page moved on
      if (job.kind === 'one') {
        if (now - job.last >= YEAR_MS) {
          job.shown++;
          job.last = now;
        }
        if (job.shown >= p.years || (job.run.ranOut && job.shown >= job.run.ranOut)) job = null;
      } else {
        const k = Math.min(job.left, job.perFrame);
        for (let i = 0; i < k; i++) addRun();
        job.left -= k;
        if (!job.left) job = null;
      }
      if (!job) finish();
      else frame = requestAnimationFrame(tick);
      draw();
    }

    function stop() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (job) { job = null; finish(); }
    }

    // When a batch ends: the bands of the middle 80% and the median, from every run so far.
    function finish() {
      bands = null;
      if (runs.length < 20) return;
      const low = [];
      const mid = [];
      const high = [];
      const column = new Float64Array(runs.length);
      for (let y = 0; y <= p.years; y++) {
        runs.forEach((r, i) => { column[i] = r.path[y]; });
        column.sort();
        low.push(quantile(column, 0.1));
        mid.push(quantile(column, 0.5));
        high.push(quantile(column, 0.9));
      }
      bands = { low, mid, high };
    }

    function reset() {
      stop();
      runs = [];
      failed = 0;
      bands = null;
      draw();
    }

    // A slider moved: the old futures belong to another plan, so start over.
    function newPlan() {
      p = params();
      naive = averageFuture(p);
      // Set the chart's height from a quick sample of futures, so it does not jump while running.
      const finals = [];
      for (let i = 0; i < 300; i++) finals.push(Math.max(...randomFuture(p).path));
      finals.sort((a, b) => a - b);
      yMax = Math.max(p.start * 1.15, Math.max(...naive.path) * 1.1, quantile(finals, 0.8));
      const step = niceStep(yMax, 4);
      yMax = Math.ceil(yMax / step) * step;
      const share = p.withdraw / p.start;
      inputs.withdraw.note.textContent = t('({p} of the start)', { p: pct(share, share < 0.1 ? 1 : 0) });
      reset();
    }

    // ---------- Text ----------
    function fact(label, value) {
      facts.append(el('dt', { text: label }), el('dd', { text: value }));
    }

    function writeText() {
      const n = runs.length;
      riskValue.textContent = n ? pct(failed / n, n >= 1000 ? 1 : 0) : '?';
      riskNote.textContent = n ? plural(n, '{failed} of {count} future', '{failed} of {count} futures', { failed: failed.toLocaleString('en-US'), count: n.toLocaleString('en-US') }) : '';
      facts.replaceChildren();

      const last = runs[runs.length - 1];
      if (job && job.kind === 'one') {
        const y = Math.max(1, job.shown);
        status.textContent = t('Year {y}: the return was {r}, the money left is {m}', { y, r: LTR(signedPct(last.returns[y - 1])), m: LTR(money(last.path[y])) });
      } else if (job) {
        status.textContent = t('Running… {n} futures so far', { n: n.toLocaleString('en-US') });
      } else if (!n) {
        status.textContent = t('Press "Run 1 future" to watch one possible future unfold, year by year.');
      } else if (n >= MAX_RUNS) {
        status.textContent = t('That\'s {n} futures, plenty! Press Reset to start over.', { n: n.toLocaleString('en-US') });
      } else if (last.ranOut) {
        status.textContent = t('The latest future: the money ran out in year {y}.', { y: last.ranOut });
      } else {
        status.textContent = t('The latest future: the money lasted, with {m} left at the end.', { m: LTR(money(last.path[p.years])) });
      }

      fact(t('With the average return every year'), naive.ranOut
        ? t('runs out in year {y}', { y: naive.ranOut })
        : t('lasts, ends with {m}', { m: LTR(money(naive.path[p.years])) }));
      if (bands) {
        fact(t('The median future ends with'), LTR(money(bands.mid[p.years])));
        fact(t('The worst 10% end with less than'), LTR(money(bands.low[p.years])));
      }
      if (failed && !job) {
        const years = runs.filter((r) => r.ranOut).map((r) => r.ranOut).sort((a, b) => a - b);
        fact(t('When it ran out, it was usually around year'), String(Math.round(quantile(years, 0.5))));
      }
    }

    // ---------- The chart ----------
    // '#4f545b' or 'rgb(79, 84, 91)' -> '79, 84, 91', to use with an alpha
    function toRgb(colour) {
      const hex = colour.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
      if (hex) {
        const h = hex[1].length === 3 ? hex[1].replace(/./g, '$&$&') : hex[1];
        return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(', ');
      }
      const m = colour.match(/[\d.]+/g);
      return m ? m.slice(0, 3).join(', ') : '128, 128, 128';
    }

    function colours() {
      const s = getComputedStyle(node);
      const rgb = (name) => s.getPropertyValue(name).trim();
      return { sim: rgb('--type-sim'), bad: rgb('--bad'), accent: s.getPropertyValue('--accent').trim(), text: s.color, muted: rgb('--muted'), mutedRgb: toRgb(rgb('--muted')), border: rgb('--border'), bg: getComputedStyle(canvas).backgroundColor, font: s.getPropertyValue('--font-mono').trim() };
    }

    function draw() {
      writeText();
      runBtns.forEach((b) => { b.disabled = runs.length >= MAX_RUNS; });

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      const c = colours();
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, w, h);

      const fontSize = w < 420 ? 10 : 11;
      ctx.font = `${fontSize}px ${c.font}`;
      const left = Math.ceil(ctx.measureText(money(yMax)).width) + 12;
      const box = { l: left, r: w - 10, t: 10, b: h - 24 };
      const X = (y) => box.l + (box.r - box.l) * y / p.years;
      const Y = (v) => box.b - (box.b - box.t) * Math.min(v, yMax * 1.02) / yMax;

      // Axes and grid lines
      ctx.lineWidth = 1;
      ctx.fillStyle = c.muted;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'right';
      const step = niceStep(yMax, 4);
      for (let v = 0; v <= yMax + 1; v += step) {
        ctx.strokeStyle = c.border;
        ctx.globalAlpha = v === 0 ? 1 : 0.6;
        ctx.beginPath(); ctx.moveTo(box.l, Y(v) + 0.5); ctx.lineTo(box.r, Y(v) + 0.5); ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillText(money(v), box.l - 6, Y(v));
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const yStep = p.years <= 10 ? 1 : p.years <= 25 ? 5 : 10;
      for (let y = 0; y <= p.years; y += yStep) ctx.fillText(String(y), X(y), box.b + 6);

      ctx.save();
      ctx.beginPath();
      ctx.rect(box.l, box.t - 4, box.r - box.l + 4, box.b - box.t + 4);
      ctx.clip();

      const line = (path, upTo = p.years) => {
        ctx.beginPath();
        ctx.moveTo(X(0), Y(path[0]));
        for (let y = 1; y <= upTo; y++) ctx.lineTo(X(y), Y(path[y]));
        ctx.stroke();
      };

      // The middle 80% of futures, as a band
      if (bands && !job) {
        ctx.fillStyle = `rgba(${c.sim}, 0.12)`;
        ctx.beginPath();
        ctx.moveTo(X(0), Y(bands.high[0]));
        for (let y = 1; y <= p.years; y++) ctx.lineTo(X(y), Y(bands.high[y]));
        for (let y = p.years; y >= 0; y--) ctx.lineTo(X(y), Y(bands.low[y]));
        ctx.closePath();
        ctx.fill();
      }

      // The futures, as faint lines (the latest MAX_LINES)
      const oneRunning = job && job.kind === 'one';
      const shown = runs.slice(Math.max(0, runs.length - MAX_LINES - (oneRunning ? 1 : 0)), runs.length - (oneRunning ? 1 : 0));
      const alpha = Math.max(0.06, Math.min(0.5, 12 / Math.sqrt(shown.length + 1) / 3));
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';
      for (const r of shown) {
        ctx.strokeStyle = r.ranOut ? `rgba(${c.bad}, ${alpha * 1.3})` : `rgba(${c.mutedRgb}, ${alpha})`;
        line(r.path, r.ranOut || p.years);
      }

      // The median
      if (bands && !job) {
        ctx.strokeStyle = `rgb(${c.sim})`;
        ctx.lineWidth = 2;
        line(bands.mid);
      }

      // The plan with the average return every year
      ctx.setLineDash([7, 5]);
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 2.5;
      line(naive.path, naive.ranOut || p.years);
      ctx.setLineDash([]);

      // The latest future, in bold
      const last = runs[runs.length - 1];
      if (last) {
        const upTo = oneRunning ? job.shown : (last.ranOut || p.years);
        ctx.strokeStyle = c.text;
        ctx.lineWidth = 2.5;
        if (upTo > 0) line(last.path, upTo);
        const end = Math.max(0, upTo);
        ctx.fillStyle = last.ranOut && end >= last.ranOut ? `rgb(${c.bad})` : c.text;
        ctx.beginPath();
        ctx.arc(X(end), Y(last.path[end]), last.ranOut && end >= last.ranOut ? 5 : 3.5, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.restore();
    }

    const later = () => { if (!frame) requestAnimationFrame(draw); };
    new MutationObserver(later).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (window.ResizeObserver) new ResizeObserver(later).observe(canvas);

    newPlan();
    return { node, pause: stop };
  }

  window.SavingsSim = { create };
})();
