/*
 * "My stats": a student signs in with Google and sees their own XP from the course sheet.
 *
 * The page sends the Google sign-in token to the Apps Script attached to the sheet
 * (apps-script/stats.gs). The script checks it and returns only that student's numbers:
 * XP per exercise, quiz, attendance and activity, their class place, an anonymous top 10
 * and the notes for them. "stats" in the site block of content/topics.json holds the
 * script's address and the Google client ID. ?stats&demo shows made-up numbers instead.
 */
(() => {
  'use strict';

  const { lang, t, pick } = window.I18N;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TOKEN_KEY = 'stats-token';
  // The most XP of each colour a quiz (מבדק) can give; quizzes are drawn as bars out of this.
  const QUIZ_MAX = 24;
  const GSI = 'https://accounts.google.com/gsi/client';

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v);
    }
    for (const c of children.flat()) if (c !== null && c !== undefined && c !== false) node.append(c);
    return node;
  }

  const fmt = (n) => String(Math.round(n * 10) / 10);
  const ordinal = (n) => {
    if (lang === 'he') return String(n);
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  // ---------- Signing in ----------
  // Google's sign-in token lasts about an hour; it is kept for this tab only.
  function savedToken() {
    try {
      const token = sessionStorage.getItem(TOKEN_KEY);
      if (!token) return '';
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.exp * 1000 > Date.now() + 60000 ? token : '';
    } catch { return ''; }
  }
  function saveToken(token) {
    try { if (token) sessionStorage.setItem(TOKEN_KEY, token); else sessionStorage.removeItem(TOKEN_KEY); } catch { /* storage unavailable */ }
  }

  let gsiLoading = null;
  function loadGsi() {
    if (window.google && window.google.accounts) return Promise.resolve();
    if (!gsiLoading) {
      gsiLoading = new Promise((resolve, reject) => {
        const s = el('script', { src: GSI, async: '' });
        s.onload = resolve;
        s.onerror = () => { gsiLoading = null; reject(new Error('gsi')); };
        document.head.append(s);
      });
    }
    return gsiLoading;
  }

  async function fetchStats(config, token) {
    // A plain-text body keeps this a "simple" request, which Apps Script answers across sites.
    const res = await fetch(config.script, { method: 'POST', body: JSON.stringify({ token }) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  // ---------- The page ----------
  let current = 0;   // a newer show() makes older, still-loading ones do nothing

  function show(main, { config, site, demo }) {
    const run = ++current;
    const author = pick(site, 'author') || '';
    const head = el('header', { class: 'topic-head' },
      el('span', { class: 'card-icon', 'aria-hidden': 'true', text: '⚗' }),
      el('div', { class: 'topic-title' }, el('h1', { text: t('My stats') })));
    const body = el('div', { class: 'topic-body stats' });
    main.replaceChildren(head, body);
    const live = () => run === current && body.isConnected;

    if (demo) {
      body.replaceChildren(el('p', { class: 'stats-demo', text: t('An example with made-up numbers.') }));
      body.append(...render(DEMO, author, null));
      return;
    }
    if (!config) {
      body.replaceChildren(notice(t('My stats isn’t set up yet.')));
      return;
    }

    const signOut = () => {
      saveToken('');
      if (window.google && window.google.accounts) window.google.accounts.id.disableAutoSelect();
      signIn();
    };

    const load = async (token) => {
      body.replaceChildren(el('p', { class: 'stats-loading', role: 'status', text: t('Loading your XP…') }));
      let data;
      try { data = await fetchStats(config, token); } catch {
        if (!live()) return;
        body.replaceChildren(notice(t('Your XP could not load. Check your connection and try again.')),
          el('button', { class: 'stats-btn', type: 'button' }, t('Try again')));
        body.querySelector('.stats-btn').addEventListener('click', () => load(token));
        return;
      }
      if (!live()) return;
      if (data.error === 'signed_out') { saveToken(''); signIn(t('Your sign-in ran out. Please sign in again.')); return; }
      if (data.error === 'not_found') {
        saveToken('');
        signIn(t('{email} isn’t on the class list. Sign in with the email you gave for the course, or ask your lecturer to add it.', { email: data.email || '' }));
        return;
      }
      if (data.error) { body.replaceChildren(notice(t('Your XP could not load. Check your connection and try again.'))); return; }
      body.replaceChildren(...render(data, author, signOut));
    };

    const signIn = (message) => {
      const slot = el('div', { class: 'stats-gsi' });
      body.replaceChildren(el('section', { class: 'panel stats-signin' },
        el('h2', { text: t('Sign in') }),
        message ? el('p', { class: 'stats-warn', role: 'status', text: message }) : null,
        el('p', { text: t('Sign in with the Google account whose email you gave for the course. Only you can see your numbers.') }),
        slot,
        el('p', { class: 'muted' }, el('a', { href: '?stats&demo' }, t('See an example with made-up numbers')))));
      loadGsi().then(() => {
        if (!live()) return;
        const id = window.google.accounts.id;
        id.initialize({
          client_id: config.client_id,
          callback: (res) => { saveToken(res.credential); if (live()) load(res.credential); },
        });
        const dark = getComputedStyle(document.documentElement).colorScheme === 'dark';
        id.renderButton(slot, { theme: dark ? 'filled_black' : 'outline', size: 'large', shape: 'pill', text: 'signin_with', locale: lang });
      }).catch(() => {
        if (live()) slot.replaceChildren(notice(t('Google sign-in could not load. Check your connection and refresh the page.')));
      });
    };

    const token = savedToken();
    if (token) load(token); else signIn();
  }

  function notice(text) {
    return el('div', { class: 'notice', role: 'status', text });
  }

  function itemLabel(it) {
    if (it.kind === 'exercise') return t('Exercise {n}', { n: it.n });
    if (it.kind === 'quiz') return t('Quiz {n}', { n: it.n });
    if (it.kind === 'attendance') return t('Attendance');
    return t('Activities');
  }

  function panel(title, ...children) {
    return el('section', { class: 'panel' }, el('h2', { text: title }), ...children);
  }

  function render(d, author, signOut) {
    const cap = d.exerciseCap || 190;
    const projectCap = d.projectCap || 500;
    const grade = (Math.min(d.purple, cap) / cap) * 50 + (Math.min(d.green, cap) / cap) * 50;
    const nodes = [];

    nodes.push(el('div', { class: 'stats-hello' },
      el('p', {}, ...greeting(d.name)),
      signOut ? el('button', { class: 'stats-btn stats-signout', type: 'button' }, t('Sign out')) : null));
    if (signOut) nodes[0].querySelector('.stats-signout').addEventListener('click', signOut);

    nodes.push(el('div', { class: 'stats-tiles' },
      tile(t('Total XP'), fmt(d.purple + d.green), [
        el('span', { class: 'xp-purple', text: t('{n} purple', { n: fmt(d.purple) }) }), ' · ',
        el('span', { class: 'xp-green', text: t('{n} green', { n: fmt(d.green) }) })]),
      tile(t('Class place'), lang === 'he' ? t('Place {n}', { n: d.place }) : ordinal(d.place),
        t('of {n} students', { n: d.classSize })),
      tile(t('Exercise grade'), fmt(grade), t('out of 100'))));

    nodes.push(panel(t('Your XP beakers'), beakers(d.purple, d.green, cap, projectCap),
      el('p', { class: 'stats-caption muted', text: t('Each colour fills its beaker up to {cap} XP, which is a full exercise grade. Anything above that pours into the project beaker as a bonus.', { cap }) })));

    if (d.items && d.items.length) nodes.push(panel(t('Where your XP came from'), breakdown(d.items)));
    else nodes.push(notice(t('No XP yet. It will show here after your first class.')));

    if (d.top && d.top.length) nodes.push(panel(t('Top 10'), leaderboard(d)));

    if (d.notes && d.notes.length) {
      nodes.push(panel(author ? t('Notes from {author}', { author }) : t('Notes'),
        el('div', { class: 'stats-notes', lang: 'he', dir: 'rtl' }, ...d.notes.map((n) => el('p', { class: 'stats-note', text: n })))));
    }
    return nodes;
  }

  // "Hi <name>, here are your stats", with the (Hebrew) name kept apart from the sentence's direction.
  function greeting(name) {
    if (!name) return [t('Here are your stats')];
    const [before, after] = t('Hi {name}, here are your stats').split('{name}');
    return [before, el('bdi', { class: 'stats-name', text: name }), after];
  }

  function tile(label, value, sub) {
    return el('div', { class: 'stats-tile' },
      el('div', { class: 'stats-tile-label', text: label }),
      el('div', { class: 'stats-tile-value', text: value }),
      el('div', { class: 'stats-tile-sub' }, sub));
  }

  // ---------- Breakdown: the XP from each source ----------
  // Grouped as attendance, exercises, quizzes, then activities. Exercises and quizzes
  // get a heading with their subtotal above their own lines. Quizzes all have the same
  // maximum, so they are bars out of QUIZ_MAX; everything else is a plain number.
  const GROUPS = [
    { kind: 'attendance' },
    { kind: 'exercise', title: 'Exercises' },
    { kind: 'quiz', title: 'Quizzes', he: 'מבדקים' },   // the site's own quizzes are בחנים
    { kind: 'activities' },
  ];

  function breakdown(items) {
    const value = (v, colour, kind) => (kind === 'quiz'
      ? el('div', { class: `stats-bar xp-${colour}` },
        el('span', { class: 'stats-bar-fill', style: `--w:${(Math.min(v, QUIZ_MAX) / QUIZ_MAX) * 100}%` }),
        el('span', { class: 'stats-bar-num', dir: 'ltr', text: `${fmt(v)} / ${QUIZ_MAX}` }))
      : el('span', { class: `stats-value xp-${colour}`, text: fmt(v) }));
    const line = (it) => el('div', { class: 'stats-row stats-row-single' },
      el('span', { class: 'stats-row-label', text: itemLabel(it) }), value(it.purple, 'purple', it.kind), value(it.green, 'green', it.kind));
    const groups = GROUPS.map((g) => {
      const own = items.filter((it) => it.kind === g.kind);
      if (!own.length) return null;
      if (!g.title) return el('div', { class: 'stats-group' }, ...own.map(line));
      const sum = (c) => own.reduce((s, it) => s + it[c], 0);
      return el('div', { class: 'stats-group' },
        el('div', { class: 'stats-row stats-group-head' },
          el('span', { text: lang === 'he' && g.he ? g.he : t(g.title) }),
          el('span', { class: 'xp-purple', text: fmt(sum('purple')) }),
          el('span', { class: 'xp-green', text: fmt(sum('green')) })),
        ...own.map((it) => Object.assign(line(it), { className: 'stats-row stats-row-sub' })));
    });
    return el('div', { class: 'stats-breakdown' },
      el('div', { class: 'stats-row stats-row-head' }, el('span'),
        el('span', { class: 'xp-purple', text: t('Purple XP') }), el('span', { class: 'xp-green', text: t('Green XP') })),
      ...groups);
  }

  // ---------- Top 10: anonymous, with the student's own row marked ----------
  function leaderboard(d) {
    const max = Math.max(1, ...d.top.map((p) => p.purple + p.green));
    const row = (p) => el('div', { class: `stats-rank${p.me ? ' is-me' : ''}` },
      el('span', { class: 'stats-rank-place', text: lang === 'he' ? String(p.place) : ordinal(p.place) }),
      el('span', { class: 'stats-rank-bar' },
        el('span', { class: 'xp-purple', style: `--w:${(Math.max(0, p.purple) / max) * 100}%` }),
        el('span', { class: 'xp-green', style: `--w:${(Math.max(0, p.green) / max) * 100}%` })),
      el('span', { class: 'stats-rank-num', text: fmt(p.purple + p.green) }),
      el('span', { class: 'stats-rank-you', text: p.me ? t('You') : '' }));
    const rows = d.top.map(row);
    if (!d.top.some((p) => p.me)) {
      rows.push(el('div', { class: 'stats-rank-gap', 'aria-hidden': 'true', text: '⋮' }),
        row({ place: d.place, purple: d.purple, green: d.green, me: true }));
    }
    return el('div', { class: 'stats-ranks' }, ...rows);
  }

  // ---------- The beakers: like the course cartoon, side beakers overflow into the project ----------
  const SVG = 'http://www.w3.org/2000/svg';
  function svg(tag, attrs = {}) {
    const node = document.createElementNS(SVG, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
  }

  // Geometry (viewBox units). Every beaker's full mark is at FULL, its floor at FLOOR.
  const TOP = 24, FULL = 78, FLOOR = 236, R = 26, PIPE_Y = FULL - 4;
  const SIDE_W = 150;
  const BEAKERS = {
    purple: { x: 20 },
    project: { x: 220, w: 460 },
    green: { x: 730 },
  };

  function beakerPath(x, w) {
    return `M ${x - 12} ${TOP} H ${x + 6} M ${x + w - 6} ${TOP} H ${x + w + 12}`
      + ` M ${x} ${TOP} V ${FLOOR - R} Q ${x} ${FLOOR} ${x + R} ${FLOOR} H ${x + w - R} Q ${x + w} ${FLOOR} ${x + w} ${FLOOR - R} V ${TOP}`;
  }
  function insidePath(x, w) {
    return `M ${x} ${TOP} V ${FLOOR - R} Q ${x} ${FLOOR} ${x + R} ${FLOOR} H ${x + w - R} Q ${x + w} ${FLOOR} ${x + w} ${FLOOR - R} V ${TOP} Z`;
  }

  // A liquid's top edge, a little wavy while it moves.
  function liquidPath(x0, x1, level, wave, phase) {
    const y = FLOOR - level * (FLOOR - FULL);
    if (level <= 0) return '';
    const steps = 16;
    let d = `M ${x0} ${FLOOR + 2} V ${y}`;
    for (let i = 0; i <= steps; i++) {
      const x = x0 + ((x1 - x0) * i) / steps;
      d += ` L ${x.toFixed(1)} ${(y + Math.sin(i / 2 + phase) * wave).toFixed(1)}`;
    }
    return `${d} V ${FLOOR + 2} Z`;
  }

  let beakerId = 0;
  function beakers(purple, green, cap, projectCap) {
    const id = `bk${++beakerId}`;
    const root = svg('svg', { viewBox: '0 0 900 262', class: 'stats-beakers', role: 'img' });
    root.setAttribute('aria-label', t('Purple XP {p} of {cap}, green XP {g} of {cap}. Project bonus: {pb} purple, {gb} green.', {
      p: fmt(Math.min(purple, cap)), g: fmt(Math.min(green, cap)), cap,
      pb: fmt(Math.max(0, purple - cap)), gb: fmt(Math.max(0, green - cap)),
    }));
    const defs = svg('defs');
    root.append(defs);
    const clip = (name, x, w) => {
      const c = svg('clipPath', { id: `${id}-${name}` });
      c.append(svg('path', { d: insidePath(x, w) }));
      defs.append(c);
      return `url(#${id}-${name})`;
    };
    const P = BEAKERS.purple, G = BEAKERS.green, J = BEAKERS.project;
    const mid = J.x + J.w / 2;

    // Pipes from each side beaker's full mark into the project beaker.
    const pipes = svg('g', { class: 'bk-pipe' });
    const pipe = (x0, x1) => {
      pipes.append(svg('rect', { x: x0, y: PIPE_Y - 9, width: x1 - x0, height: 18, class: 'bk-glass' }));
      pipes.append(svg('path', { d: `M ${x0} ${PIPE_Y - 9} H ${x1} M ${x0} ${PIPE_Y + 9} H ${x1}`, class: 'bk-line' }));
    };
    pipe(P.x + SIDE_W, J.x);
    pipe(J.x + J.w, G.x);
    root.append(pipes);
    const streamP = svg('rect', { x: P.x + SIDE_W, y: PIPE_Y - 6, width: 0, height: 12, class: 'bk-liquid xp-purple' });
    const streamG = svg('rect', { x: G.x, y: PIPE_Y - 6, width: 0, height: 12, class: 'bk-liquid xp-green' });
    root.append(streamP, streamG);

    const glass = (x, w) => root.append(svg('path', { d: insidePath(x, w), class: 'bk-glass' }));
    glass(P.x, SIDE_W); glass(J.x, J.w); glass(G.x, SIDE_W);

    const liquid = (clipUrl, colour) => {
      const g = svg('g', { 'clip-path': clipUrl });
      const p = svg('path', { class: `bk-liquid xp-${colour}` });
      g.append(p);
      root.append(g);
      return p;
    };
    const liqP = liquid(clip('p', P.x, SIDE_W), 'purple');
    const liqG = liquid(clip('g', G.x, SIDE_W), 'green');
    const projClip = clip('j', J.x, J.w);
    const liqJP = liquid(projClip, 'purple');
    const liqJG = liquid(projClip, 'green');

    // Shine, tick marks, outlines and labels on top of the liquid.
    const shine = (x, w) => root.append(svg('rect', { x: x + 10, y: TOP + 8, width: 12, height: FLOOR - TOP - 40, rx: 6, class: 'bk-shine' }),
      svg('rect', { x: x + w - 22, y: TOP + 8, width: 8, height: FLOOR - TOP - 50, rx: 4, class: 'bk-shine' }));
    shine(P.x, SIDE_W); shine(J.x, J.w); shine(G.x, SIDE_W);
    const ticks = (x, dir) => {
      for (let i = 1; i <= 4; i++) {
        const y = FLOOR - (i / 4) * (FLOOR - FULL);
        root.append(svg('path', { d: `M ${x} ${y} h ${dir * 34}`, class: 'bk-tick' }));
      }
    };
    ticks(P.x + SIDE_W, -1);
    ticks(G.x, 1);
    root.append(svg('path', { d: `M ${mid} ${FULL - 18} V ${FLOOR}`, class: 'bk-line' }));
    for (const [x, w] of [[P.x, SIDE_W], [J.x, J.w], [G.x, SIDE_W]]) root.append(svg('path', { d: beakerPath(x, w), class: 'bk-line' }));

    const text = (x, y, str, cls = '') => {
      const n = svg('text', { x, y, class: `bk-text ${cls}`, 'text-anchor': 'middle' });
      n.textContent = str;
      root.append(n);
      return n;
    };
    text(J.x + J.w / 2, FULL - 30, t('Project bonus'), 'bk-title');
    text(P.x + SIDE_W / 2, FLOOR - 16, t('Purple'), 'bk-name');
    text(G.x + SIDE_W / 2, FLOOR - 16, t('Green'), 'bk-name');
    text(P.x + SIDE_W / 2 - 14, FULL - 8, String(cap), 'bk-scale');
    text(G.x + SIDE_W / 2 + 14, FULL - 8, String(cap), 'bk-scale');
    text(J.x + J.w / 4, FULL + 22, String(projectCap), 'bk-scale');
    text(J.x + (3 * J.w) / 4, FULL + 22, String(projectCap), 'bk-scale');
    const numP = text(P.x + SIDE_W / 2, FLOOR - 52, '0', 'bk-num');
    const numG = text(G.x + SIDE_W / 2, FLOOR - 52, '0', 'bk-num');
    const numJP = text(J.x + J.w / 4, FLOOR - 52, '', 'bk-num bk-num-bonus');
    const numJG = text(J.x + (3 * J.w) / 4, FLOOR - 52, '', 'bk-num bk-num-bonus');

    // ----- Animation: fill the side beakers, then overflow through the pipes -----
    const sides = [
      { value: purple, liq: liqP, num: numP, stream: streamP, proj: liqJP, projNum: numJP, x0: P.x, x1: P.x + SIDE_W, px0: J.x, px1: mid, sx: P.x + SIDE_W, sw: J.x - P.x - SIDE_W, flow: 1 },
      { value: green, liq: liqG, num: numG, stream: streamG, proj: liqJG, projNum: numJG, x0: G.x, x1: G.x + SIDE_W, px0: mid, px1: J.x + J.w, sx: G.x, sw: G.x - J.x - J.w, flow: -1 },
    ];
    const FILL = 1600, POUR = 350, RISE = 1300;
    const ease = (k) => 1 - (1 - Math.min(1, Math.max(0, k))) ** 3;
    const draw = (ms) => {
      let moving = false;
      for (const s of sides) {
        const own = Math.max(0, Math.min(s.value, cap));
        const bonus = Math.max(0, s.value - cap);
        const fillTime = FILL * Math.max(0.35, own / cap);
        const k = ease(ms / fillTime);
        const wave = k < 1 ? 3 : 0;
        s.liq.setAttribute('d', liquidPath(s.x0, s.x1, (own / cap) * k, wave, ms / 120));
        s.num.textContent = k < 1 ? String(Math.round(own * k)) : fmt(own);
        // Overflow: the pipe fills, then the project half rises.
        const pour = bonus > 0 ? Math.min(1, Math.max(0, (ms - fillTime) / POUR)) : 0;
        const w = s.sw * pour;
        s.stream.setAttribute('width', w);
        if (s.flow < 0) s.stream.setAttribute('x', s.sx - w);
        const r = bonus > 0 ? ease((ms - fillTime - POUR) / RISE) : 0;
        const level = Math.min(1, bonus / projectCap) * r;
        s.proj.setAttribute('d', liquidPath(s.px0, s.px1, level, r > 0 && r < 1 ? 3 : 0, ms / 120 + 1));
        s.projNum.textContent = bonus > 0 && r > 0 ? `+${r < 1 ? Math.round(bonus * r) : fmt(bonus)}` : '';
        if (k < 1 || (bonus > 0 && r < 1)) moving = true;
      }
      return moving;
    };

    const play = () => {
      if (reducedMotion) { draw(1e9); return; }
      const start = performance.now();
      const frame = (now) => { if (draw(now - start) && root.isConnected) requestAnimationFrame(frame); };
      requestAnimationFrame(frame);
    };
    draw(0);

    const replay = el('button', { class: 'stats-btn stats-replay', type: 'button' }, t('↻ Replay'));
    replay.addEventListener('click', play);
    const box = el('div', { class: 'stats-beakers-box' }, root, replay);
    // Plays once the beakers are on screen.
    const seen = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { seen.disconnect(); play(); }
    }, { threshold: 0.3 });
    seen.observe(root);
    return box;
  }

  // ---------- Made-up numbers for ?stats&demo ----------
  const DEMO = (() => {
    const items = [
      { kind: 'exercise', n: 1, purple: 14, green: 0 },
      { kind: 'exercise', n: 2, purple: 12, green: 12 },
      { kind: 'exercise', n: 3, purple: 25, green: 3 },
      { kind: 'exercise', n: 4, purple: 21, green: 21 },
      { kind: 'exercise', n: 5, purple: 49, green: 39 },
      { kind: 'quiz', n: 1, purple: 11, green: 11 },
      { kind: 'quiz', n: 2, purple: 22, green: 22 },
      { kind: 'quiz', n: 3, purple: 15, green: 15 },
      { kind: 'attendance', n: null, purple: 30, green: 35 },
      { kind: 'activities', n: null, purple: 25, green: 25 },
    ];
    const purple = items.reduce((s, i) => s + i.purple, 0);
    const green = items.reduce((s, i) => s + i.green, 0);
    const others = [520, 498, 470, 455, 401, 388, 388, 350, 342, 330, 310, 296, 280, 260, 251, 240, 233, 210, 198, 180, 166, 150, 131, 120, 95, 77, 60];
    const all = others.map((n, i) => {
      const p = Math.round(n * (0.45 + (i % 5) * 0.03));
      return { purple: p, green: n - p, me: false };
    }).concat({ purple, green, me: true });
    all.sort((a, b) => (b.purple + b.green) - (a.purple + a.green));
    all.forEach((p, i) => {
      const prev = all[i - 1];
      p.place = prev && prev.purple + prev.green === p.purple + p.green ? prev.place : i + 1;
    });
    const me = all.find((p) => p.me);
    return {
      name: 'נועה כהן',
      purple, green, exerciseCap: 190, projectCap: 500, items,
      place: me.place, classSize: all.length, top: all.slice(0, 10),
      notes: ['עבודה מצוינת בתרגיל 5! שימו לב לשמות משתנים ברורים יותר.', 'כדאי להגיע לשעת הקבלה לפני המבדק הבא.'],
    };
  })();

  window.Stats = { show };
})();
