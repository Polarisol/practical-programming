/*
 * Loads content/topics.json and renders either the home page (topic cards)
 * or a single topic page (videos, written material, bots, links).
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

  function plural(n, word) {
    return `${n} ${word}${n === 1 ? '' : 's'}`;
  }

  function asList(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  function notice(...children) {
    return el('div', { class: 'notice', role: 'status' }, ...children);
  }

  // ---------- Theme toggle ----------
  const toggle = document.querySelector('.theme-toggle');
  const currentTheme = () =>
    root.dataset.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function updateToggle() {
    if (!toggle) return;
    const dark = currentTheme() === 'dark';
    toggle.textContent = dark ? '☀' : '☾';
    toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch { /* storage unavailable */ }
      updateToggle();
    });
    updateToggle();
  }

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

  function addTilt(card) {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
      if (canHover && !reducedMotion && root.dataset.view !== 'list') {
        card.style.setProperty('--ry', `${(px - 0.5) * 8}deg`);
        card.style.setProperty('--rx', `${(0.5 - py) * 8}deg`);
      }
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }

  const topicHref = (id) => (id ? `?id=${encodeURIComponent(id)}` : './');

  function topicCard(topic, index) {
    const videos = asList(topic.videos).length;
    const bots = asList(topic.bots).length;
    const notes = asList(topic.material).length;
    const meta = [];
    if (videos) meta.push(el('span', { text: `▶ ${plural(videos, 'video')}` }));
    if (notes) meta.push(el('span', { text: '¶ notes' }));
    if (bots) meta.push(el('span', { text: `◆ ${plural(bots, 'bot')}` }));

    const card = el(
      'a',
      { class: 'card', href: topicHref(topic.id), 'data-route': topic.id, style: `--i:${index}` },
      el('span', { class: 'card-icon', 'aria-hidden': 'true', text: topic.icon || '>_' }),
      el('h2', { text: topic.title || topic.id }),
      topic.blurb ? el('p', { text: topic.blurb }) : null,
      meta.length ? el('div', { class: 'card-meta' }, ...meta) : null,
    );
    addTilt(card);
    return card;
  }

  function showHome(main, topics, site) {
    const title = site.title || 'Class Resources';
    document.title = site.author ? `${title} by ${site.author}` : title;
    const heading = el('h1', { class: 'hero-title' });
    scrambleTitle(heading, title);
    const grid = el('div', { class: 'topic-grid' });
    if (topics.length) topics.forEach((t, i) => grid.append(topicCard(t, i)));
    else grid.append(notice('No topics yet. Add one to content/topics.json.'));

    main.replaceChildren(
      el(
        'section',
        { class: 'hero' },
        el('p', { class: 'prompt', text: '$ ls ~/topics' }),
        heading,
        site.author ? el('p', { class: 'hero-byline', text: `by ${site.author}` }) : null,
        site.subtitle ? el('p', { class: 'hero-sub', text: site.subtitle }) : null,
      ),
      el('section', { 'aria-label': 'Topics' }, grid),
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

  const LINE_TYPES = { bot: 'Bot', text: 'Text', video: 'Video', link: 'Link' };

  // Every line starts with a coloured type tag: Bot / Text / Video / Link.
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
      open() {
        if (openLine && openLine !== item) openLine.close();
        openLine = item;
        button.setAttribute('aria-expanded', 'true');
        body.hidden = false;
        if (onOpen) onOpen(body);
        button.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });
      },
      close() {
        if (openLine === item) openLine = null;
        button.setAttribute('aria-expanded', 'false');
        body.hidden = true;
        if (onClose) onClose(body);
      },
    };
    button.addEventListener('click', () => (openLine === item ? item.close() : item.open()));
    return { node: el('div', { class: 'line-item' }, button, body), item };
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
        onOpen: (body) => body.replaceChildren(videoFrame(v, true)),
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

  function topicNav(topics) {
    const indicator = el('span', { class: 'nav-indicator', 'aria-hidden': 'true' });
    const items = new Map();
    const list = el('ul', { class: 'nav-list' }, indicator);
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
      items.set(t.id, { link, title, text });
      list.append(el('li', {}, link));
    }

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
      // In the phone strip, scroll the selected topic into view.
      if (list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: li.offsetLeft - 16, behavior: animate && !reducedMotion ? 'smooth' : 'auto' });
      }
    };

    window.addEventListener('resize', () => place(false));
    return {
      node: el('nav', { class: 'topic-nav', 'aria-label': 'Topics' }, list),
      select(id) {
        if (id === activeId) return;
        const first = activeId === null;
        if (items.has(activeId)) items.get(activeId).link.removeAttribute('aria-current');
        activeId = id;
        const item = items.get(id);
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
      main.replaceChildren(notice('That topic doesn’t exist (yet). ', el('a', { href: './', 'data-route': MAIN }, 'See all topics')));
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
          ...linkLines(asList(topic.links)),
        ];
        sections = rows.length ? [el('div', { class: 'line-list topic-lines' }, ...rows)] : [];
      } else {
        sections = [
          botsPanel(asList(topic.bots), topic),
          videosPanel(asList(topic.videos)),
          materialPanel(asList(topic.material)),
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
      if (id === MAIN) showHome(main, topics, data.site);
      else showTopic(main, topics.find((t) => t.id === id), fullName);
      document.body.dataset.page = id === MAIN ? 'home' : 'topic';
      if (canvas) canvas.dataset.intensity = id === MAIN ? '' : 'dim';
      nav.select(id);
    };

    // Links marked data-route (sidebar, cards, logo) switch pages without a reload.
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-route]');
      if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const id = a.dataset.route;
      if (id === currentId()) return;
      history.pushState(null, '', topicHref(id));
      show(id);
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
    window.addEventListener('popstate', () => show(currentId()));
    window.matchMedia('(min-width: 820px)').addEventListener('change', () => nav.place(false));
    show(currentId());
  }

  // ---------- Boot ----------
  renderApp();
})();
