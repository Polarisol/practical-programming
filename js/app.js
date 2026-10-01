/*
 * Loads content/topics.json and renders either the home page (content/home.md)
 * or a single topic page (bots, videos, written material, quizzes, links).
 * You should not need to edit this file to add or change topics.
 */
(() => {
  'use strict';

  const CONTENT = 'content/';
  const root = document.documentElement;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Small helpers ----------
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

  // Only allow http(s) links (relative paths like "assets/sheet.pdf" are fine too).
  function safeUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value.trim(), location.href);
      return url.protocol === 'http:' || url.protocol === 'https:' ? url : null;
    } catch {
      return null;
    }
  }

  function linkAttrs(url) {
    const external = url.origin !== location.origin;
    return { href: url.href, target: external ? '_blank' : null, rel: external ? 'noopener noreferrer' : null };
  }

  // Accepts a bare ID or any common YouTube URL form.
  function youtubeId(video) {
    const s = String(video.youtube || video.youtubeId || video.url || '').trim();
    if (/^[\w-]{11}$/.test(s)) return s;
    const m = s.match(/(?:[?&]v=|youtu\.be\/|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
    return m ? m[1] : null;
  }

  function asList(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  function notice(...children) {
    return el('div', { class: 'notice', role: 'status' }, ...children);
  }

  // ---------- Theme toggle ----------
  // One in the top bar and one on the entry screen.
  const toggles = document.querySelectorAll('.theme-toggle');
  const currentTheme = () => root.dataset.theme || 'light';

  function updateToggle() {
    const dark = currentTheme() === 'dark';
    for (const toggle of toggles) {
      toggle.textContent = dark ? '☀' : '☾';
      toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  for (const toggle of toggles) {
    toggle.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch { /* storage unavailable */ }
      updateToggle();
    });
  }
  updateToggle();

  // ---------- View toggle (cards <-> minimal list), used on every page ----------
  const viewListeners = [];
  const viewToggle = document.querySelector('.view-toggle');
  const ICON_CARDS = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/>'
    + '<rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/>'
    + '<rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>';
  const ICON_LIST = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';

  // The button shows the view you will switch *to*.
  function updateViewToggle() {
    if (!viewToggle) return;
    const list = root.dataset.view === 'list';
    viewToggle.innerHTML = list ? ICON_CARDS : ICON_LIST;
    const label = list ? 'Switch to card view' : 'Switch to list view';
    viewToggle.setAttribute('aria-label', label);
    viewToggle.title = label;
  }

  if (viewToggle) {
    viewToggle.addEventListener('click', () => {
      const list = root.dataset.view !== 'list';
      if (list) root.dataset.view = 'list';
      else delete root.dataset.view;
      try { localStorage.setItem('view', list ? 'list' : 'cards'); } catch { /* storage unavailable */ }
      updateViewToggle();
      viewListeners.forEach((fn) => fn());
    });
    updateViewToggle();
  }

  // ---------- Data ----------
  async function loadData(container) {
    try {
      const res = await fetch(`${CONTENT}topics.json`, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      data.site = data.site || {};
      data.topics = Array.isArray(data.topics) ? data.topics : [];
      return data;
    } catch (err) {
      const msg = location.protocol === 'file:'
        ? notice(
            el('strong', { text: 'Open this site through a web server. ' }),
            'Browsers block loading content from local files. In this folder run ',
            el('code', { text: 'python -m http.server 8000' }),
            ' and open http://localhost:8000',
          )
        : notice(
            el('strong', { text: 'Could not load content/topics.json. ' }),
            `Check that the file exists and is valid JSON (${err.message}).`,
          );
      container.append(msg);
      return null;
    }
  }

  function applySite(site) {
    const title = site.title || 'Class Resources';
    const fullName = site.author ? `${title} by ${site.author}` : title;
    const fill = (selector, text) =>
      document.querySelectorAll(selector).forEach((n) => { n.textContent = text; });
    fill('[data-site-name]', fullName);
    fill('[data-site-author]', site.author ? `by ${site.author}` : '');
    fill('[data-site-subtitle]', site.subtitle || '');
    fill('[data-site-footer]', site.footer || '');
    return { title, fullName };
  }

  // ---------- Home page ----------
  const GLYPHS = '!<>-_\\/[]{}=+*^?#@$%&';

  // Types text in, with each letter "decoding" from random symbols.
  function scramble(out, text) {
    if (reducedMotion) { out.textContent = text; return; }
    let revealed = 0;
    let tick = 0;
    const timer = setInterval(() => {
      tick++;
      if (tick % 2 === 0) revealed++;
      let s = text.slice(0, revealed);
      for (let i = revealed; i < Math.min(text.length, revealed + 3); i++) {
        s += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      out.textContent = s;
      if (revealed >= text.length) clearInterval(timer);
    }, 40);
  }

  function scrambleTitle(node, text) {
    node.setAttribute('aria-label', text);
    const out = el('span', { 'aria-hidden': 'true' });
    node.replaceChildren(out);
    scramble(out, text);
  }

  const topicHref = (id) => (id ? `?id=${encodeURIComponent(id)}` : './');

  // The Main page text comes from a Markdown file (site.home, default "home.md").
  function showHome(main, site) {
    const title = site.title || 'Class Resources';
    document.title = site.author ? `${title} by ${site.author}` : title;
    const heading = el('h1', { class: 'hero-title' });
    scrambleTitle(heading, title);
    const file = site.home || 'home.md';
    const article = el('article', { class: 'prose home-intro' }, el('p', { class: 'muted', text: 'Loading…' }));
    loadMaterial(file)
      .then((text) => article.replaceChildren(...renderMarkdown(text)))
      .catch(() => article.replaceChildren(
        el('p', { class: 'muted', text: `Could not load ${CONTENT}${file}.` }),
      ));

    main.replaceChildren(
      el(
        'section',
        { class: 'hero' },
        el('p', { class: 'prompt', text: '$ cat ~/welcome.md' }),
        heading,
        site.author ? el('p', { class: 'hero-byline', text: `by ${site.author}` }) : null,
        site.subtitle ? el('p', { class: 'hero-sub', text: site.subtitle }) : null,
      ),
      article,
    );
  }

  // ---------- Topic page ----------
  function panel(title, ...children) {
    return el('section', { class: 'panel' }, el('h2', { text: title }), ...children);
  }

  function videoFrame(v, autoplay = false) {
    const id = youtubeId(v);
    if (!id) return null;
    const params = new URLSearchParams({ rel: '0' });
    if (Number(v.start) > 0) params.set('start', String(Math.floor(v.start)));
    if (autoplay) params.set('autoplay', '1');
    return el(
      'div',
      { class: 'video-frame' },
      el('iframe', {
        src: `https://www.youtube-nocookie.com/embed/${id}?${params}`,
        title: v.title || 'YouTube video',
        loading: autoplay ? null : 'lazy',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        allowfullscreen: '',
        referrerpolicy: 'strict-origin-when-cross-origin',
      }),
    );
  }

  function videosPanel(videos) {
    const items = videos
      .map((v) => {
        const frame = videoFrame(v);
        if (!frame) return null;
        return el('figure', { class: 'video' }, frame, v.title ? el('figcaption', { text: v.title }) : null);
      })
      .filter(Boolean);
    return items.length ? panel('Videos', el('div', { class: 'video-grid' }, ...items)) : null;
  }

  // A "copy" button on code blocks, so students can paste commands exactly.
  function addCopyButton(pre) {
    const button = el('button', { class: 'copy-btn', type: 'button', text: 'copy' });
    button.addEventListener('click', async () => {
      const code = (pre.querySelector('code') || pre).textContent.replace(/\n$/, '');
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = 'copied ✓';
      } catch {
        // Clipboard blocked: select the text so Ctrl+C works.
        const range = document.createRange();
        range.selectNodeContents(pre.querySelector('code') || pre);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        button.textContent = 'press Ctrl+C';
      }
      setTimeout(() => { button.textContent = 'copy'; }, 1800);
    });
    const wrap = el('div', { class: 'code-wrap' });
    pre.replaceWith(wrap);
    wrap.append(pre, button);
  }

  function renderMarkdown(text) {
    if (window.marked && window.DOMPurify) {
      const html = window.DOMPurify.sanitize(window.marked.parse(text));
      const div = el('div');
      div.innerHTML = html;
      div.querySelectorAll('a[href]').forEach((a) => {
        const url = safeUrl(a.getAttribute('href'));
        if (url && url.origin !== location.origin) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
      });
      div.querySelectorAll('pre').forEach(addCopyButton);
      return [...div.childNodes];
    }
    // Libraries failed to load (e.g. offline): show the raw text instead.
    return [el('pre', { text })];
  }

  const materialCache = new Map();
  function loadMaterial(file) {
    if (!materialCache.has(file)) {
      materialCache.set(file, fetch(`${CONTENT}${file}`, { cache: 'no-cache' }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      }));
    }
    return materialCache.get(file);
  }

  function materialPanel(files) {
    if (!files.length) return null;
    const body = el('div');
    for (const file of files) {
      const article = el('article', { class: 'prose material' }, el('p', { class: 'muted', text: 'Loading…' }));
      body.append(article);
      loadMaterial(file)
        .then((text) => article.replaceChildren(...renderMarkdown(text)))
        .catch(() => article.replaceChildren(
          el('p', { class: 'muted', text: `Could not load ${CONTENT}${file}.` }),
        ));
    }
    return panel('Written material', body);
  }

  // ---------- Quizzes ----------
  // A quiz is a Markdown file in content/quizzes/:
  //   # Quiz title                 (optional)
  //   ## Question                  (each "## " starts a question; text/code below it is part of the question)
  //   - [ ] wrong option           ("- [x]" marks a correct option; several [x] = choose all that apply)
  //     > feedback                 (indented "> " under an option = feedback for that option)
  //   > explanation                (unindented "> " after the options = shown with the corrections)
  const OPTION_RE = /^[-*]\s+\[([ xX])\]\s+(.*)$/;
  const FENCE_RE = /^\s*(```|~~~)/;

  function parseQuiz(text, file) {
    const quiz = { title: '', intro: [], questions: [] };
    let q = null;
    let option = null;
    let fence = false;

    const finish = () => {
      if (!q) return;
      const correct = q.options.filter((o) => o.correct).length;
      if (!q.options.length) console.warn(`${file}: question "${q.heading}" has no options, skipped.`);
      else if (!correct) console.warn(`${file}: question "${q.heading}" has no correct option [x], skipped.`);
      else {
        quiz.questions.push({
          heading: q.heading,
          prompt: q.prompt.join('\n').trim(),
          options: q.options.map((o) => ({ ...o, feedback: o.feedback.join(' ').trim() })),
          explanation: q.explanation.join('\n').trim(),
          multi: correct > 1,
        });
      }
    };

    for (const line of text.split(/\r?\n/)) {
      // Code blocks belong to the question text, whatever they contain.
      if (fence || FENCE_RE.test(line)) {
        if (FENCE_RE.test(line)) fence = !fence;
        if (q && !q.options.length) q.prompt.push(line);
        else if (!q) quiz.intro.push(line);
        continue;
      }
      const h = line.match(/^(#{1,2})\s+(.*)$/);
      if (h && h[1] === '#' && !q && !quiz.title) { quiz.title = h[2].trim(); continue; }
      if (h && h[1] === '##') {
        finish();
        q = { heading: h[2].trim(), prompt: [], options: [], explanation: [] };
        option = null;
        continue;
      }
      if (!q) { quiz.intro.push(line); continue; }

      const opt = line.match(OPTION_RE);
      const quote = line.match(/^(\s*)>\s?(.*)$/);
      if (opt && !q.explanation.length) {
        option = { text: opt[2].trim(), correct: opt[1] !== ' ', feedback: [] };
        q.options.push(option);
      } else if (quote && q.options.length) {
        if (quote[1] && option && !q.explanation.length) option.feedback.push(quote[2]);
        else q.explanation.push(quote[2]);
      } else if (!q.options.length) {
        q.prompt.push(line);
      } else if (option && /^\s+\S/.test(line) && !q.explanation.length) {
        option.text += ` ${line.trim()}`; // an option that continues on the next line
      }
    }
    finish();
    quiz.intro = quiz.intro.join('\n').trim();
    return quiz;
  }

  // Short Markdown (an option, a feedback line) without wrapping paragraphs.
  function renderInline(text) {
    const span = el('span');
    if (window.marked && window.DOMPurify) span.innerHTML = window.DOMPurify.sanitize(window.marked.parseInline(text));
    else span.textContent = text;
    return span;
  }

  // "quizzes" in topics.json: "file.md", ["a.md", "b.md"] or [{ "title": "...", "file": "..." }].
  function quizEntries(value) {
    return asList(value)
      .map((q) => (typeof q === 'string' ? { file: q } : q))
      .filter((q) => q && typeof q.file === 'string');
  }

  function scoreMessage(pct) {
    if (pct === 100) return 'Perfect score! 🎉';
    if (pct >= 80) return 'Great job! Check the corrections for what you missed.';
    if (pct >= 50) return 'Good effort. Read the feedback below, then try again.';
    return 'Keep practicing. Read the feedback below, then try again.';
  }

  let quizCount = 0;

  function buildQuiz(box, quiz, entry, showTitle) {
    const id = ++quizCount;
    const title = entry.title || quiz.title || 'Quiz';
    if (!quiz.questions.length) {
      box.replaceChildren(el('p', { class: 'muted', text: `No valid questions found in ${CONTENT}${entry.file}.` }));
      return;
    }

    const items = quiz.questions.map((q, qi) => {
      const name = `quiz-${id}-q${qi}`;
      const headingId = `${name}-h`;
      const opts = q.options.map((o, oi) => {
        const input = el('input', { type: q.multi ? 'checkbox' : 'radio', name, value: String(oi) });
        const tag = el('span', { class: 'quiz-tag', hidden: '' });
        const feedback = o.feedback ? el('div', { class: 'quiz-feedback', hidden: '' }, renderInline(o.feedback)) : null;
        const row = el('li', { class: 'quiz-opt' },
          el('label', {}, input, el('span', { class: 'quiz-opt-text' }, renderInline(o.text)), tag),
          feedback);
        return { o, input, tag, feedback, row };
      });
      const badge = el('span', { class: 'quiz-badge', hidden: '' });
      const explanation = q.explanation
        ? el('div', { class: 'prose quiz-explain', hidden: '' }, ...renderMarkdown(q.explanation))
        : null;
      const group = el('div', { class: 'quiz-q', role: 'group', 'aria-labelledby': headingId },
        el('p', { class: 'quiz-heading', id: headingId },
          el('span', { class: 'quiz-num', text: `${qi + 1}.` }), renderInline(q.heading), badge),
        q.prompt ? el('div', { class: 'prose quiz-prompt' }, ...renderMarkdown(q.prompt)) : null,
        q.multi ? el('p', { class: 'quiz-hint', text: 'Choose all that apply.' }) : null,
        el('ul', { class: 'quiz-opts' }, ...opts.map((x) => x.row)),
        explanation);
      return { opts, badge, explanation, group };
    });

    const answered = (it) => it.opts.some((x) => x.input.checked);
    const score = el('div', { class: 'quiz-score', role: 'status', tabindex: '-1', hidden: '' });
    const progress = el('span', { class: 'quiz-progress' });
    const submit = el('button', { class: 'btn', type: 'button', text: 'Submit answers' });
    const retry = el('button', { class: 'btn', type: 'button', text: '↻ Try again', hidden: '' });
    const updateProgress = () => {
      progress.textContent = `${items.filter(answered).length} / ${items.length} answered`;
    };

    submit.addEventListener('click', () => {
      const missing = items.filter((it) => !answered(it)).length;
      if (missing && !window.confirm(`${missing} of ${items.length} questions are not answered yet. Submit anyway?`)) return;
      let right = 0;
      for (const it of items) {
        let ok = true;
        for (const x of it.opts) {
          const picked = x.input.checked;
          const correct = x.o.correct;
          if (picked !== correct) ok = false;
          x.input.disabled = true;
          x.row.classList.toggle('is-correct', picked && correct);
          x.row.classList.toggle('is-wrong', picked && !correct);
          x.row.classList.toggle('is-missed', !picked && correct);
          x.tag.hidden = !(picked || correct);
          x.tag.textContent = picked ? (correct ? '✓ your answer' : '✗ your answer') : 'correct answer';
          if (x.feedback) x.feedback.hidden = !(picked || correct);
        }
        if (ok) right++;
        it.group.classList.toggle('is-right', ok);
        it.group.classList.toggle('is-wrong', !ok);
        it.badge.hidden = false;
        it.badge.textContent = ok ? '✓ Correct' : answered(it) ? '✗ Incorrect' : '— Not answered';
        if (it.explanation) it.explanation.hidden = false;
      }
      const pct = Math.round((right / items.length) * 100);
      score.replaceChildren(
        el('strong', { class: 'quiz-score-num', text: `${right} / ${items.length}` }),
        el('span', { class: 'quiz-score-pct', text: `${pct}%` }),
        el('span', { text: scoreMessage(pct) }),
      );
      score.dataset.band = pct === 100 ? 'perfect' : pct >= 50 ? 'pass' : 'low';
      score.hidden = false;
      submit.hidden = true;
      retry.hidden = false;
      progress.hidden = true;
      score.focus({ preventScroll: true });
      score.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'auto' : 'smooth' });
    });

    retry.addEventListener('click', () => {
      for (const it of items) {
        for (const x of it.opts) {
          x.input.checked = false;
          x.input.disabled = false;
          x.row.classList.remove('is-correct', 'is-wrong', 'is-missed');
          x.tag.hidden = true;
          if (x.feedback) x.feedback.hidden = true;
        }
        it.group.classList.remove('is-right', 'is-wrong');
        it.badge.hidden = true;
        if (it.explanation) it.explanation.hidden = true;
      }
      score.hidden = true;
      submit.hidden = false;
      retry.hidden = true;
      progress.hidden = false;
      updateProgress();
      box.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' });
    });

    const n = items.length;
    const bubble = el('p', { class: 'bot-bubble' });
    typeBubble(bubble, `Ready? ${n} question${n === 1 ? '' : 's'}. Let's see what you know!`, 700);
    const hero = el('div', { class: 'quiz-hero' },
      el('div', { class: 'quiz-mark', 'aria-hidden': 'true' },
        el('span', { class: 'quiz-mark-glyph', text: '?' }), el('span', { class: 'quiz-mark-shadow' })),
      bubble);

    box.addEventListener('change', updateProgress);
    updateProgress();
    box.replaceChildren(...[
      showTitle ? el('h3', { class: 'quiz-title', text: title }) : null,
      hero,
      quiz.intro ? el('div', { class: 'prose quiz-intro' }, ...renderMarkdown(quiz.intro)) : null,
      score,
      ...items.map((it) => it.group),
      el('div', { class: 'quiz-actions' }, submit, retry, progress),
    ].filter(Boolean));
  }

  // `onTitle` receives the quiz's title once the file has loaded.
  function quizView(entry, { showTitle = true, onTitle } = {}) {
    const box = el('div', { class: 'quiz' }, el('p', { class: 'muted', text: 'Loading…' }));
    loadMaterial(entry.file)
      .then((text) => {
        const quiz = parseQuiz(text, entry.file);
        buildQuiz(box, quiz, entry, showTitle);
        if (onTitle) onTitle(entry.title || quiz.title || 'Quiz');
      })
      .catch(() => box.replaceChildren(
        el('p', { class: 'muted', text: `Could not load ${CONTENT}${entry.file}.` }),
      ));
    return box;
  }

  function quizPanel(quizzes) {
    if (!quizzes.length) return null;
    const section = panel(quizzes.length > 1 ? 'Quizzes' : 'Quiz', ...quizzes.map((q) => quizView(q)));
    section.classList.add('quiz-panel');
    return section;
  }

  // ---------- Bots: animated robots at the top of a topic ----------
  const ROBOT_SVG = `
    <svg viewBox="0 0 120 140" width="100%" height="100%" focusable="false">
      <g class="bot-float">
        <line x1="60" y1="24" x2="60" y2="12" class="bot-line"/>
        <circle cx="60" cy="9" r="5" class="bot-light"/>
        <rect x="10" y="44" width="8" height="20" rx="4" class="bot-part"/>
        <rect x="102" y="44" width="8" height="20" rx="4" class="bot-part"/>
        <rect x="16" y="24" width="88" height="62" rx="18" class="bot-shell"/>
        <rect x="27" y="35" width="66" height="40" rx="12" class="bot-screen"/>
        <g class="eye-track"><g class="bot-eyes">
          <ellipse cx="47" cy="53" rx="6" ry="7" class="bot-eye"/>
          <ellipse cx="73" cy="53" rx="6" ry="7" class="bot-eye"/>
        </g></g>
        <path d="M51 65 Q60 71 69 65" class="bot-line"/>
        <rect x="54" y="86" width="12" height="7" class="bot-part"/>
        <path d="M32 100 L19 117" class="bot-arm"/>
        <path d="M88 100 L103 83" class="bot-arm bot-wave"/>
        <rect x="30" y="92" width="60" height="38" rx="12" class="bot-shell"/>
        <circle cx="60" cy="111" r="6" class="bot-light bot-heart"/>
      </g>
    </svg>`;

  function robot() {
    const node = el('div', { class: 'robot', 'aria-hidden': 'true' });
    node.innerHTML = ROBOT_SVG;
    return node;
  }

  // Shows "typing…" dots, then types the greeting into the speech bubble.
  function typeBubble(bubble, text, delay) {
    const visible = el('span', { 'aria-hidden': 'true' });
    bubble.replaceChildren(el('span', { class: 'sr-only', text }), visible);
    if (reducedMotion) { visible.textContent = text; return; }

    visible.append(el('span', { class: 'typing' }, el('i'), el('i'), el('i')));
    setTimeout(() => {
      let i = 0;
      const timer = setInterval(() => {
        visible.textContent = text.slice(0, ++i);
        if (i >= text.length) clearInterval(timer);
      }, 28);
    }, delay);
  }

  // Robots' eyes follow the mouse / finger.
  let eyesBound = false;
  function trackEyes() {
    if (eyesBound || reducedMotion) return;
    eyesBound = true;
    let raf = 0, px = 0, py = 0;
    const update = () => {
      raf = 0;
      document.querySelectorAll('.robot').forEach((r) => {
        const b = r.getBoundingClientRect();
        const dx = px - (b.left + b.width / 2);
        const dy = py - (b.top + b.height * 0.38);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 160);
        r.style.setProperty('--ex', `${(dx / d) * 4.5 * k}px`);
        r.style.setProperty('--ey', `${(dy / d) * 3.5 * k}px`);
      });
    };
    window.addEventListener('pointermove', (e) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });
  }

  function botsPanel(bots, topic) {
    const items = bots
      .map((b, i) => {
        const url = safeUrl(b.url);
        if (!url) return null;
        const greeting = b.description || `Hi! Want to practice ${topic.title || 'this topic'} with me?`;
        const bubble = el('p', { class: 'bot-bubble' });
        typeBubble(bubble, greeting, 700 + i * 1200);
        return el(
          'div',
          { class: 'bot-card', style: `--i:${i}` },
          robot(),
          el(
            'div',
            { class: 'bot-body' },
            el('strong', { class: 'bot-name', text: b.label || 'Practice bot' }),
            bubble,
            el('a', { class: 'btn btn-bot', ...linkAttrs(url) }, 'Start chatting ↗'),
          ),
        );
      })
      .filter(Boolean);
    if (!items.length) return null;
    trackEyes();
    const section = panel(
      items.length > 1 ? 'Practice with a bot' : 'Practice with the bot',
      el('div', { class: 'bot-grid' }, ...items),
    );
    section.classList.add('bot-panel');
    return section;
  }

  function linksPanel(links) {
    const items = links
      .map((l) => {
        const url = safeUrl(l.url);
        return url ? el('li', {}, el('a', linkAttrs(url), l.label || url.hostname)) : null;
      })
      .filter(Boolean);
    return items.length ? panel('More resources', el('ul', { class: 'link-list' }, ...items)) : null;
  }

  // ---------- Topic page, list view: every item is one line ----------
  // Videos and written material expand in place; only one line is open at a time.
  let openLine = null;
  let lineCount = 0;
  const lineItems = new WeakMap(); // line node -> its open/close handle

  const LINE_TYPES = { bot: 'Bot', text: 'Text', video: 'Video', quiz: 'Quiz', link: 'Link' };

  // Every line starts with a coloured type tag: Bot / Text / Video / Quiz / Link.
  function lineParts(type, label, sub, end, icon) {
    return [
      el('span', { class: 'line-type', text: LINE_TYPES[type] }),
      icon ? el('span', { class: 'line-icon', 'aria-hidden': 'true' }, icon) : null,
      el('span', { class: 'line-label', text: label }),
      sub ? el('span', { class: 'line-sub', text: sub }) : null,
      el('span', { class: 'line-end', 'aria-hidden': 'true', text: end }),
    ];
  }

  function expandableLine(type, label, { onOpen, onClose } = {}) {
    const id = `line-body-${++lineCount}`;
    const button = el(
      'button',
      { class: 'line', type: 'button', 'data-type': type, 'aria-expanded': 'false', 'aria-controls': id },
      ...lineParts(type, label, null, '▸'),
    );
    const body = el('div', { class: 'line-body', id, hidden: '' });
    const item = {
      label: button.querySelector('.line-label'),
      body,
      // `auto`: opened by the page itself, not a click — no scrolling, no autoplay.
      open(auto = false) {
        if (openLine && openLine !== item) openLine.close();
        openLine = item;
        button.setAttribute('aria-expanded', 'true');
        body.hidden = false;
        if (onOpen) onOpen(body, auto);
        if (!auto) button.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });
      },
      close() {
        if (openLine === item) openLine = null;
        button.setAttribute('aria-expanded', 'false');
        body.hidden = true;
        if (onClose) onClose(body);
      },
    };
    button.addEventListener('click', () => (openLine === item ? item.close() : item.open()));
    const node = el('div', { class: 'line-item' }, button, body);
    lineItems.set(node, item);
    return { node, item };
  }

  function botLines(bots) {
    const rows = bots
      .map((b) => {
        const url = safeUrl(b.url);
        if (!url) return null;
        return el('a', { class: 'line line-bot', 'data-type': 'bot', ...linkAttrs(url) },
          ...lineParts('bot', b.label || 'Practice bot', b.description, 'chat ↗', robot()));
      })
      .filter(Boolean);
    if (rows.length) trackEyes();
    return rows;
  }

  function videoLines(videos) {
    const rows = videos
      .filter((v) => youtubeId(v))
      .map((v, i) => expandableLine('video', v.title || `Video ${i + 1}`, {
        onOpen: (body, auto) => body.replaceChildren(videoFrame(v, !auto)),
        onClose: (body) => body.replaceChildren(), // removing the player stops the video
      }).node);
    return rows;
  }

  function materialLines(files) {
    const rows = files.map((file) => {
      const { node, item } = expandableLine('text', 'Written material');
      item.body.classList.add('prose');
      item.body.append(el('p', { class: 'muted', text: 'Loading…' }));
      loadMaterial(file)
        .then((text) => {
          let nodes = renderMarkdown(text);
          // The document's first heading becomes the line's label.
          const first = nodes.find((n) => n.nodeType === Node.ELEMENT_NODE);
          if (first && first.tagName === 'H1') {
            item.label.textContent = first.textContent;
            nodes = nodes.filter((n) => n !== first);
          }
          item.body.replaceChildren(...nodes);
        })
        .catch(() => item.body.replaceChildren(
          el('p', { class: 'muted', text: `Could not load ${CONTENT}${file}.` }),
        ));
      return node;
    });
    return rows;
  }

  // The quiz is built once, so answers survive closing and reopening the line.
  function quizLines(quizzes) {
    return quizzes.map((entry) => {
      const { node, item } = expandableLine('quiz', entry.title || 'Quiz');
      item.body.append(quizView(entry, {
        showTitle: false,
        onTitle: (title) => { item.label.textContent = title; },
      }));
      return node;
    });
  }

  function linkLines(links) {
    const rows = links
      .map((l) => {
        const url = safeUrl(l.url);
        return url
          ? el('a', { class: 'line', 'data-type': 'link', ...linkAttrs(url) }, ...lineParts('link', l.label || url.hostname, null, '↗'))
          : null;
      })
      .filter(Boolean);
    return rows;
  }

  // ---------- Topic list (sidebar on wide screens, a strip on phones) ----------
  // "Main" plus every topic; a glowing marker glides to the selected one.
  const MAIN = '';

  // Sidebar on wide screens; on phones, a bar showing the current topic that opens the list.
  function topicNav(topics) {
    const indicator = el('span', { class: 'nav-indicator', 'aria-hidden': 'true' });
    const items = new Map();
    const list = el('ul', { class: 'nav-list', id: 'nav-list' }, indicator);
    const entries = [{ id: MAIN, title: 'Main', icon: '~' }, ...topics];
    for (const t of entries) {
      const text = t.title || t.id;
      const title = el('span', { class: 'nav-title', text });
      const link = el(
        'a',
        { class: 'nav-item', href: topicHref(t.id), 'data-route': t.id },
        el('span', { class: 'nav-icon', 'aria-hidden': 'true', text: t.icon || '>_' }),
        title,
      );
      items.set(t.id, { link, title, text, icon: t.icon || '>_' });
      list.append(el('li', {}, link));
    }

    const toggleIcon = el('span', { class: 'nav-icon', 'aria-hidden': 'true' });
    const toggleTitle = el('span', { class: 'nav-title' });
    const toggle = el(
      'button',
      { class: 'nav-toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'nav-list' },
      toggleIcon,
      toggleTitle,
      el('span', { class: 'nav-toggle-label', text: 'Topics' }),
      el('span', { class: 'nav-chevron', 'aria-hidden': 'true', text: '▾' }),
    );
    const node = el('nav', { class: 'topic-nav', 'aria-label': 'Topics' }, toggle, list);

    let activeId = null;
    const place = (animate) => {
      const item = items.get(activeId);
      const li = item && item.link.parentElement;
      if (!li || !li.offsetHeight) { indicator.style.opacity = '0'; return; }
      indicator.classList.toggle('no-anim', !animate);
      indicator.style.opacity = '1';
      indicator.style.transform = `translate(${li.offsetLeft}px, ${li.offsetTop}px)`;
      indicator.style.width = `${li.offsetWidth}px`;
      indicator.style.height = `${li.offsetHeight}px`;
    };

    const setOpen = (open) => {
      node.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (open) place(false);
    };
    toggle.addEventListener('click', () => setOpen(!node.classList.contains('open')));
    document.addEventListener('click', (e) => {
      if (node.classList.contains('open') && !node.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && node.classList.contains('open')) { setOpen(false); toggle.focus(); }
    });

    window.addEventListener('resize', () => place(false));
    return {
      node,
      select(id) {
        setOpen(false);
        if (id === activeId) return;
        const first = activeId === null;
        if (items.has(activeId)) items.get(activeId).link.removeAttribute('aria-current');
        activeId = id;
        const item = items.get(id);
        toggleIcon.textContent = item ? item.icon : '?';
        toggleTitle.textContent = item ? item.text : 'Topics';
        if (!item) { place(false); return; }
        item.link.setAttribute('aria-current', 'page');
        scramble(item.title, item.text);
        place(!first);
        // A short burst of light when the marker arrives.
        indicator.classList.remove('arrive');
        void indicator.offsetWidth;
        indicator.classList.add('arrive');
      },
      place,
    };
  }

  // ---------- Topic page ----------
  let drawTopicBody = null;
  viewListeners.push(() => drawTopicBody && drawTopicBody());

  function showTopic(main, topic, siteTitle) {
    if (!topic) {
      document.title = `Topic not found · ${siteTitle}`;
      main.replaceChildren(notice('That topic doesn’t exist (yet). Pick one from the list.'));
      return;
    }

    const topicTitle = topic.title || topic.id;
    document.title = `${topicTitle} · ${siteTitle}`;
    const heading = el('h1');
    scrambleTitle(heading, topicTitle);
    const body = el('div', { class: 'topic-body' });
    main.replaceChildren(
      el(
        'header',
        { class: 'topic-head' },
        el('span', { class: 'card-icon', 'aria-hidden': 'true', text: topic.icon || '>_' }),
        heading,
        topic.blurb ? el('p', { text: topic.blurb }) : null,
      ),
      body,
    );

    drawTopicBody = () => {
      openLine = null;
      let sections;
      if (root.dataset.view === 'list') {
        const rows = [
          ...botLines(asList(topic.bots)),
          ...videoLines(asList(topic.videos)),
          ...materialLines(asList(topic.material)),
          ...quizLines(quizEntries(topic.quizzes)),
          ...linkLines(asList(topic.links)),
        ];
        sections = rows.length ? [el('div', { class: 'line-list topic-lines' }, ...rows)] : [];
        // A topic with a single item shows it opened.
        if (rows.length === 1 && lineItems.has(rows[0])) lineItems.get(rows[0]).open(true);
      } else {
        sections = [
          botsPanel(asList(topic.bots), topic),
          videosPanel(asList(topic.videos)),
          materialPanel(asList(topic.material)),
          quizPanel(quizEntries(topic.quizzes)),
          linksPanel(asList(topic.links)),
        ];
      }
      body.replaceChildren(...sections.filter(Boolean));
    };
    drawTopicBody();
  }

  // ---------- App: one page, switching between Main and topics in place ----------
  async function renderApp() {
    const main = document.getElementById('app');
    const canvas = document.getElementById('ascii-bg');
    const data = await loadData(main);
    if (!data) return;
    const { fullName } = applySite(data.site);
    const topics = data.topics.filter((t) => t && t.id);
    const currentId = () => new URLSearchParams(location.search).get('id') || MAIN;

    const nav = topicNav(topics);
    document.getElementById('topic-nav-slot').replaceWith(nav.node);

    const show = (id) => {
      drawTopicBody = null;
      openLine = null;
      if (id === MAIN) showHome(main, data.site);
      else showTopic(main, topics.find((t) => t.id === id), fullName);
      document.body.dataset.page = id === MAIN ? 'home' : 'topic';
      if (canvas) canvas.dataset.intensity = entryOpen() ? '' : 'dim';
      nav.select(id);
    };

    // Links marked data-route (sidebar, logo) switch pages without a reload.
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-route]');
      if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const id = a.dataset.route;
      if (id === currentId()) return;
      history.pushState({ main: true }, '', topicHref(id));
      show(id);
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
    window.addEventListener('popstate', () => show(currentId()));
    window.matchMedia('(min-width: 820px)').addEventListener('change', () => nav.place(false));
    show(currentId());
  }

  // ---------- Entry screen: shown over the main page until ENTER is pressed ----------
  function entryOpen() {
    return 'entry' in document.documentElement.dataset;
  }

  // The entry screen is its own step in the browser history, so Back returns to it.
  function setEntry(open) {
    if (open) document.documentElement.dataset.entry = '';
    else delete document.documentElement.dataset.entry;
    const canvas = document.getElementById('ascii-bg');
    if (canvas) canvas.dataset.intensity = open ? '' : 'dim';
    window.scrollTo(0, 0);
  }

  function setupEntry() {
    const btn = document.querySelector('.entry-btn');
    if (!btn) return;
    if (entryOpen()) history.replaceState({ entry: true }, '');
    const enter = () => {
      history.pushState({ main: true }, '', './');
      setEntry(false);
    };
    btn.addEventListener('click', enter);
    // The Enter key works too, without having to tab to the button first.
    document.addEventListener('keydown', (e) => {
      if (entryOpen() && e.key === 'Enter' && e.target === document.body) enter();
    });
    window.addEventListener('popstate', () => {
      const open = Boolean(history.state && history.state.entry);
      if (open !== entryOpen()) setEntry(open);
    });
  }

  // ---------- Boot ----------
  setupEntry();
  renderApp();
})();
