/*
 * "Will we make the deadline?", a risk simulation for "simulations" in topics.json ({ "type": "deadline-risk" }).
 * A small project has four tasks done one after the other. Each task has a best guess (how many
 * days it should take) and an uncertainty (how much longer it might take). Each run is one
 * possible way the project could go: every task gets a random length, drawn from a triangle
 * that starts a bit below the guess, peaks at the guess and stretches far above it, because
 * tasks rarely finish much early but often run late. The finish days pile up in a histogram,
 * and the share that land on or before the deadline is the chance of making it.
 * The dashed line is the plan made from the best guesses, which looks safe but usually isn't.
 */
(() => {
  'use strict';

  const MAX_RUNS = 100000;    // stop here
  const FRAMES = 25;          // a batch of runs is spread over this many frames
  const TASK_MS = 450;        // "Run 1" fills one task every TASK_MS
  const EARLY = 0.8;          // a task can finish at best in 80% of its guess
  const I18N = window.I18N || { lang: 'en', t: (s, vars) => (vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s) };
  const { t } = I18N;
  const plural = I18N.plural || ((n, one, many, vars) => t(n === 1 ? one : many, { n, ...vars }));
  const num = (n) => n.toLocaleString('en-US');

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

  // A random number from a triangle: never below `low`, most often near `mode`, never above `high`.
  function triangle(low, mode, high) {
    if (high <= low) return mode;
    const u = Math.random();
    const cut = (mode - low) / (high - low);
    return u < cut
      ? low + Math.sqrt(u * (high - low) * (mode - low))
      : high - Math.sqrt((1 - u) * (high - low) * (high - mode));
  }

  const range = (task) => [task.guess * EARLY, task.guess, task.guess * (1 + task.risk / 100)];

  // One possible project: how long each task took, and the day it all finished.
  function project(tasks) {
    const lengths = tasks.map((task) => triangle(...range(task)));
    return { lengths, finish: lengths.reduce((a, b) => a + b, 0) };
  }

  function quantile(sorted, q) {
    if (!sorted.length) return 0;
    const i = (sorted.length - 1) * q;
    const lo = Math.floor(i);
    return sorted[lo] + (sorted[Math.min(lo + 1, sorted.length - 1)] - sorted[lo]) * (i - lo);
  }

  function niceStep(span, count) {
    const raw = Math.max(span / count, 1);
    const pow = 10 ** Math.floor(Math.log10(raw));
    return [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= raw);
  }

  const TASKS = [
    { name: t('Plan'), guess: 3, risk: 50 },
    { name: t('Write the code'), guess: 10, risk: 80 },
    { name: t('Find and fix bugs'), guess: 5, risk: 150 },
    { name: t('Write the docs'), guess: 2, risk: 50 },
  ];

  function create() {
    const tasks = TASKS.map((task) => ({ ...task }));
    let deadline = 24;
    let finishes = [];       // the finish day of every run so far
    let sorted = null;       // `finishes`, sorted, after a batch ends
    let counts = [];         // the histogram: how many runs finished on each day
    let made = 0;            // runs that finished on or before the deadline
    let last = null;         // the latest run
    let job = null;          // the animation in progress
    let frame = 0;
    let hi = 1;              // the latest day a run can finish

    const plan = () => tasks.reduce((a, task) => a + task.guess, 0);
    const day = (finish) => Math.ceil(finish - 1e-9); // finishing during day 23 counts as day 23

    // ---------- Controls ----------
    function slider(label, min, max, step, value, show, onInput) {
      const input = el('input', { type: 'range', min: String(min), max: String(max), step: String(step), value: String(value), 'aria-label': label });
      const out = el('output', { class: 'deadline-value', text: show(value) });
      input.addEventListener('input', () => {
        const v = Number(input.value);
        out.textContent = show(v);
        onInput(v);
      });
      return { input, out };
    }

    const days = (v) => plural(v, '{n} day', '{n} days');
    const taskRows = tasks.map((task, i) => {
      const guess = slider(t('{task}: best guess', { task: task.name }), 1, 20, 1, task.guess, days, (v) => { task.guess = v; newPlan(); });
      const risk = slider(t('{task}: can run over by', { task: task.name }), 0, 200, 10, task.risk, (v) => `+${v}%`, (v) => { task.risk = v; newPlan(); });
      return el('tr', {},
        el('th', { scope: 'row' }, el('span', { class: `deadline-dot is-task${i}`, 'aria-hidden': 'true' }), task.name),
        el('td', {}, el('div', { class: 'deadline-cell' }, el('span', { class: 'deadline-small', text: t('Best guess') }), guess.input, guess.out)),
        el('td', {}, el('div', { class: 'deadline-cell' }, el('span', { class: 'deadline-small', text: t('Can run over by') }), risk.input, risk.out)));
    });
    const deadlineCtl = slider(t('Deadline'), 5, 120, 1, deadline, (v) => t('day {n}', { n: v }), (v) => { deadline = v; recount(); draw(); });
    const planOut = el('output', { class: 'deadline-value' });

    const gantt = el('canvas', { class: 'deadline-gantt', role: 'img', 'aria-label': t('The latest run: how long each task took, next to the plan') });
    const chart = el('canvas', { class: 'deadline-chart', role: 'img', 'aria-label': t('Histogram of the day the project finished, with the deadline') });

    const runBtns = [1, 100, 10000].map((n) => {
      const b = el('button', { type: 'button', class: n === 1 ? 'btn sim-play' : 'sim-btn', text: n === 1 ? t('▶ Run 1 project') : t('Run {n}', { n: num(n) }) });
      b.addEventListener('click', () => start(n));
      return b;
    });
    const resetBtn = el('button', { type: 'button', class: 'sim-btn', text: t('Reset') });
    resetBtn.addEventListener('click', reset);

    const status = el('p', { class: 'sim-status', role: 'status' });
    const chance = el('span', { class: 'deadline-chance-value', text: '?' });
    const chanceNote = el('span', { class: 'deadline-chance-note' });
    const facts = el('dl', { class: 'deadline-facts' });

    const key = (cls, label) => el('li', {}, el('span', { class: `deadline-key ${cls}`, 'aria-hidden': 'true' }), label);
    const node = el('div', { class: 'sim deadline-sim' },
      el('div', { class: 'deadline-table-wrap' },
        el('table', { class: 'deadline-table' },
          el('thead', {}, el('tr', {},
            el('th', { scope: 'col', text: t('Task') }),
            el('th', { scope: 'col', text: t('Best guess') }),
            el('th', { scope: 'col', text: t('Can run over by') }))),
          el('tbody', {}, ...taskRows))),
      el('div', { class: 'deadline-bottom' },
        el('label', { class: 'deadline-cell deadline-deadline' }, el('span', { class: 'sim-label', text: t('Deadline') }), deadlineCtl.input, deadlineCtl.out),
        el('p', { class: 'deadline-plan' }, el('span', { class: 'sim-label', text: t('The plan') }), planOut)),
      el('p', { class: 'sim-about', text: t('The tasks are done one after another. Each run gives every task a random length: at best a little shorter than the guess, most often close to it, and sometimes much longer. Each run is one way the project could go.') }),
      el('div', { class: 'sim-stage' },
        el('div', { class: 'deadline-charts' },
          el('span', { class: 'sim-label', text: t('The latest run') }), gantt,
          el('span', { class: 'sim-label', text: t('All runs: the day the project finished') }), chart),
        el('div', { class: 'sim-side' },
          el('div', { class: 'sim-actions' }, ...runBtns, resetBtn),
          el('div', { class: 'deadline-chance' }, el('span', { class: 'sim-label', text: t('Chance to make the deadline') }), chance, chanceNote),
          status,
          facts,
          el('ul', { class: 'sim-legend' },
            key('is-made', t('finished on time')),
            key('is-late', t('finished late')),
            key('is-deadline', t('the deadline')),
            key('is-plan', t('the plan: all the best guesses added up'))),
        ),
      ),
    );

    // ---------- Running ----------
    function add(run) {
      finishes.push(run.finish);
      const d = day(run.finish);
      counts[d] = (counts[d] || 0) + 1;
      if (run.finish <= deadline + 1e-9) made++;
      last = run;
    }

    function recount() {
      made = 0;
      for (const f of finishes) if (f <= deadline + 1e-9) made++;
    }

    function start(n) {
      stop();
      sorted = null;
      n = Math.min(n, MAX_RUNS - finishes.length);
      if (n <= 0) return draw();
      if (n === 1) job = { kind: 'one', run: project(tasks), shown: 0, began: performance.now() };
      else job = { kind: 'many', left: n, perFrame: Math.ceil(n / FRAMES) };
      frame = requestAnimationFrame(tick);
      draw();
    }

    function tick(now) {
      frame = 0;
      if (!job) return;
      if (!node.isConnected) { stop(); return; } // the page moved on
      if (job.kind === 'one') {
        job.shown = Math.min(tasks.length, (now - job.began) / TASK_MS);
        if (job.shown >= tasks.length) { add(job.run); job = null; }
      } else {
        const k = Math.min(job.left, job.perFrame);
        for (let i = 0; i < k; i++) add(project(tasks));
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
      if (job) {
        if (job.kind === 'one') add(job.run);
        job = null;
        finish();
      }
    }

    function finish() {
      sorted = Float64Array.from(finishes).sort();
    }

    function reset() {
      stop();
      finishes = [];
      sorted = null;
      counts = [];
      made = 0;
      last = null;
      draw();
    }

    // A slider of a task moved: the old runs belong to another project, so start over.
    function newPlan() {
      hi = Math.ceil(tasks.reduce((a, task) => a + range(task)[2], 0)) + 1;
      planOut.textContent = t('finishes on day {n}', { n: plan() });
      reset();
    }

    // ---------- Text ----------
    function fact(label, value) {
      facts.append(el('dt', { text: label }), el('dd', { text: value }));
    }

    function writeText() {
      const n = finishes.length;
      chance.textContent = n ? `${(made / n * 100).toFixed(n >= 1000 ? 1 : 0)}%` : '?';
      chanceNote.textContent = n ? plural(n, '{made} of {count} run', '{made} of {count} runs', { made: num(made), count: num(n) }) : '';
      facts.replaceChildren();

      if (job && job.kind === 'one') {
        const i = Math.min(tasks.length - 1, Math.floor(job.shown));
        const task = tasks[i];
        const took = job.run.lengths[i];
        status.textContent = t('{task}: planned {g}, took {d}', { task: task.name, g: days(task.guess), d: plural(Number(took.toFixed(1)), '{n} day', '{n} days') });
      } else if (job) {
        status.textContent = t('Running… {n} runs so far', { n: num(n) });
      } else if (!n) {
        status.textContent = t('Press "Run 1 project" to watch one way the project could go, task by task.');
      } else if (n >= MAX_RUNS) {
        status.textContent = t('That\'s {n} runs, plenty! Press Reset to start over.', { n: num(n) });
      } else {
        const d = day(last.finish);
        status.textContent = last.finish <= deadline + 1e-9
          ? t('The latest run finished on day {d}: on time.', { d })
          : t('The latest run finished on day {d}: {late} late.', { d, late: plural(d - deadline, '{n} day', '{n} days') });
      }

      fact(t('The plan says'), t('day {n}', { n: plan() }));
      if (sorted && sorted.length >= 20) {
        const onPlan = sorted.filter((f) => f <= plan() + 1e-9).length / sorted.length;
        fact(t('Runs that finished by the plan\'s day'), `${Math.round(onPlan * 100)}%`);
        fact(t('The average run finished on'), t('day {n}', { n: (sorted.reduce((a, b) => a + b, 0) / sorted.length).toFixed(1) }));
        fact(t('To be 90% sure, set the deadline to'), t('day {n}', { n: day(quantile(sorted, 0.9)) }));
      }
    }

    // ---------- Drawing ----------
    function colours() {
      const s = getComputedStyle(node);
      const v = (name) => s.getPropertyValue(name).trim();
      return { sim: v('--type-sim'), bad: v('--bad'), ok: v('--ok'), accent: v('--accent'), text: s.color, muted: v('--muted'), border: v('--border'), bg: getComputedStyle(chart).backgroundColor, font: v('--font-mono') };
    }

    function prepare(canvas) {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return null;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, w, h };
    }

    // Both charts share one days axis from day 0, so the latest run lines up with the histogram.
    function axis(w) {
      const left = 12;
      const right = w - 12;
      const span = Math.max(hi, deadline + 1, plan() + 1);
      return { left, right, X: (d) => left + (right - left) * d / span, from: 0, to: span };
    }

    function line(ctx, x, top, bottom, colour, dash, width) {
      ctx.save();
      ctx.strokeStyle = colour;
      ctx.lineWidth = width;
      ctx.setLineDash(dash);
      ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
      ctx.restore();
    }

    function drawGantt(c) {
      const g = prepare(gantt);
      if (!g) return;
      const { ctx, w, h } = g;
      const a = axis(w);
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, w, h);
      const run = job && job.kind === 'one' ? job.run : last;
      const shown = job && job.kind === 'one' ? job.shown : tasks.length;
      const rowH = (h - 12) / tasks.length;
      const hues = taskColours(c);
      let planAt = 0;
      let at = 0;
      tasks.forEach((task, i) => {
        const y = 6 + i * rowH;
        // the plan, as an outline
        ctx.strokeStyle = c.muted;
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1;
        ctx.strokeRect(a.X(planAt) + 0.5, y + 2.5, a.X(planAt + task.guess) - a.X(planAt) - 1, rowH - 5);
        ctx.setLineDash([]);
        // what really happened
        if (run && shown > i) {
          const part = Math.min(1, shown - i);
          ctx.fillStyle = hues[i];
          ctx.fillRect(a.X(at), y + 4, (a.X(at + run.lengths[i]) - a.X(at)) * part, rowH - 8);
        }
        planAt += task.guess;
        if (run) at += run.lengths[i];
      });
      line(ctx, a.X(deadline), 0, h, `rgb(${c.bad})`, [], 2);
      line(ctx, a.X(plan()), 0, h, c.accent, [6, 4], 2);
    }

    function taskColours(c) {
      return [0.95, 0.75, 0.55, 0.4].map((a) => `rgba(${c.sim}, ${a})`);
    }

    function drawChart(c) {
      const g = prepare(chart);
      if (!g) return;
      const { ctx, w, h } = g;
      const a = axis(w);
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, w, h);
      const fontSize = w < 420 ? 10 : 11;
      ctx.font = `${fontSize}px ${c.font}`;
      const top = 18;
      const bottom = h - 22;

      // Day labels
      ctx.fillStyle = c.muted;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const step = niceStep(a.to - a.from, w < 420 ? 5 : 9);
      for (let d = Math.ceil(a.from / step) * step; d <= a.to; d += step) ctx.fillText(String(d), a.X(d - 0.5), bottom + 6);
      ctx.strokeStyle = c.border;
      ctx.beginPath(); ctx.moveTo(a.left, bottom + 0.5); ctx.lineTo(a.right, bottom + 0.5); ctx.stroke();

      // Bars: one per day; day d covers the time from d - 1 to d
      const most = Math.max(1, ...counts.filter(Boolean));
      for (let d = 0; d < counts.length; d++) {
        if (!counts[d]) continue;
        const x0 = a.X(d - 1) + 0.5;
        const x1 = a.X(d) - 0.5;
        const y = bottom - (bottom - top) * counts[d] / most;
        ctx.fillStyle = d <= deadline ? `rgba(${c.ok}, 0.75)` : `rgba(${c.bad}, 0.75)`;
        ctx.fillRect(x0, y, Math.max(1, x1 - x0), bottom - y);
      }

      // The deadline and the plan
      line(ctx, a.X(deadline), 4, bottom, `rgb(${c.bad})`, [], 2);
      line(ctx, a.X(plan()), 4, bottom, c.accent, [6, 4], 2);
      ctx.fillStyle = `rgb(${c.bad})`;
      ctx.textBaseline = 'top';
      const dx = a.X(deadline);
      const label = t('deadline');
      const width = ctx.measureText(label).width;
      ctx.textAlign = dx + 4 + width > a.right ? 'right' : 'left';
      ctx.fillText(label, dx + (ctx.textAlign === 'right' ? -4 : 4), 2);

      // The latest run, as a dot under its day
      if (last && !(job && job.kind === 'many')) {
        ctx.fillStyle = c.text;
        ctx.beginPath();
        ctx.arc(a.X(day(last.finish) - 0.5), bottom, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    function draw() {
      writeText();
      runBtns.forEach((b) => { b.disabled = finishes.length >= MAX_RUNS; });
      const c = colours();
      drawGantt(c);
      drawChart(c);
    }

    const later = () => { if (!frame) requestAnimationFrame(draw); };
    new MutationObserver(later).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (window.ResizeObserver) { const ro = new ResizeObserver(later); ro.observe(gantt); ro.observe(chart); }

    newPlan();
    return { node, pause: stop };
  }

  window.DeadlineSim = { create };
})();
