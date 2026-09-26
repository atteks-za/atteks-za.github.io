/* global DOMAINS, PROJECTS, CERTS, LINKS */
const root = document.documentElement;
root.classList.add('js');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const plural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');

$('#yr').textContent = new Date().getFullYear();

/* ── Toast ─────────────────────────────────── */
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ── Theme: follows the OS until the visitor picks one ── */
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
function savedTheme() { try { return localStorage.getItem('theme'); } catch (e) { return null; } }
function applyTheme(theme) {
  root.classList.toggle('dark', theme === 'dark');
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  $$('.theme-toggle').forEach(b => {
    b.innerHTML = '<i class="fa-solid fa-' + (theme === 'dark' ? 'sun' : 'moon') + '"></i>';
    b.setAttribute('aria-label', label);
    b.title = label;
  });
  $('meta[name="theme-color"]').content = theme === 'dark' ? '#070b14' : '#f8fafc';
}
function toggleTheme() {
  const next = root.classList.contains('dark') ? 'light' : 'dark';
  try { localStorage.setItem('theme', next); } catch (e) {}
  applyTheme(next);
}
applyTheme(root.classList.contains('dark') ? 'dark' : 'light');
$$('.theme-toggle').forEach(b => b.addEventListener('click', toggleTheme));
darkQuery.addEventListener('change', e => { if (!savedTheme()) applyTheme(e.matches ? 'dark' : 'light'); });
requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('theme-ready')));

/* ── Copy email ─────────────────────────────── */
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(LINKS.email);
    toast('Email copied: ' + LINKS.email);
  } catch (e) {
    window.location.href = 'mailto:' + LINKS.email;
  }
}
$$('[data-copy-email]').forEach(b => b.addEventListener('click', copyEmail));

/* ── Hero: rotating focus + stats ───────────── */
const focusWords = ['FortiGate SD-WAN', 'Windows Server & AD', 'AWS cloud networking', 'Kubernetes on EKS', 'Infrastructure as Code', 'Backup & recovery'];
if (!reduceMotion) {
  let w = 0;
  const rot = $('#rotator');
  setInterval(() => {
    rot.classList.add('out');
    setTimeout(() => {
      w = (w + 1) % focusWords.length;
      rot.textContent = focusWords[w];
      rot.classList.remove('out');
    }, 300);
  }, 2600);
}

const stats = { projects: PROJECTS.length, domains: Object.keys(DOMAINS).length, certs: CERTS.length };
$$('[data-stat]').forEach(el => {
  const target = stats[el.dataset.stat];
  if (reduceMotion) { el.textContent = target; return; }
  const t0 = performance.now(), dur = 1200;
  (function tick(now) {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
});

/* ── View counter (Abacus, free, no account) ──
   Counts once per browser session so refreshes don't inflate it.
   Only the live domain adds to the count; local previews just read it. */
(async function viewCounter() {
  const API = 'https://abacus.jasoncameron.dev';
  const KEY = 'pepsnet-portfolio/views';
  const isLive = location.hostname === 'portfolio.pepsnet.co.za';
  let counted = false;
  try { counted = sessionStorage.getItem('viewCounted') === '1'; } catch (e) {}
  const action = isLive && !counted ? 'hit' : 'get';

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 5000);
  try {
    const res = await fetch(API + '/' + action + '/' + KEY, { signal: ctrl.signal });
    if (!res.ok) return;
    const { value } = await res.json();
    if (typeof value !== 'number') return;
    if (action === 'hit') { try { sessionStorage.setItem('viewCounted', '1'); } catch (e) {} }

    const el = $('#viewCount');
    const fmt = n => n.toLocaleString('en-ZA');
    $('#views').hidden = false;
    if (reduceMotion || value < 10) { el.textContent = fmt(value); return; }
    const t0 = performance.now(), dur = 1200;
    (function tick(now) {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = fmt(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  } catch (e) {
    // Counter unavailable: keep the badge hidden
  } finally {
    clearTimeout(timer);
  }
})();

/* ── Projects ───────────────────────────────── */
const PER_PAGE = 9;
const state = { domain: 'all', q: '', page: 1 };

function highlight(text, q) {
  const safe = esc(text);
  if (!q) return safe;
  const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
  return safe.replace(re, '<mark>$1</mark>');
}

function cardHTML(p, i, q) {
  const d = DOMAINS[p.domain];
  return '<a class="project-card" href="' + esc(p.url) + '" target="_blank" rel="noopener" style="--c: var(--c-' + p.domain + '); --i: ' + i + '">' +
    '<span class="domain-tag"><i class="fa-solid ' + d.icon + '"></i>' + esc(d.label) + '</span>' +
    '<h3>' + highlight(p.title, q) + '</h3>' +
    '<p>' + highlight(p.summary, q) + '</p>' +
    '<ul class="tags">' + p.tags.map(t => '<li>' + highlight(t, q) + '</li>').join('') + '</ul>' +
    '<span class="card-link">View project <i class="fa-solid fa-arrow-right"></i></span>' +
  '</a>';
}

// Featured
$('#featured').innerHTML = PROJECTS.filter(p => p.featured).map(p => {
  const d = DOMAINS[p.domain];
  return '<a class="featured-card reveal" href="' + esc(p.url) + '" target="_blank" rel="noopener" style="--c: var(--c-' + p.domain + ')">' +
    '<span class="domain-tag"><i class="fa-solid ' + d.icon + '"></i>' + esc(d.label) + '</span>' +
    '<span class="star"><i class="fa-solid fa-star"></i> Featured</span>' +
    '<h3>' + esc(p.title) + '</h3>' +
    '<p>' + esc(p.summary) + '</p>' +
    '<ul class="tags">' + p.tags.map(t => '<li>' + esc(t) + '</li>').join('') + '</ul>' +
    '<span class="card-link">Read the write-up <i class="fa-solid fa-arrow-right"></i></span>' +
  '</a>';
}).join('');

// Filter chips
const filterDefs = [{ key: 'all', label: 'All', icon: 'fa-layer-group', n: PROJECTS.length }]
  .concat(Object.keys(DOMAINS).map(k => ({ key: k, label: DOMAINS[k].label, icon: DOMAINS[k].icon, n: PROJECTS.filter(p => p.domain === k).length })));
$('#filters').innerHTML = filterDefs.map(f =>
  '<button class="chip" type="button" role="tab" data-domain="' + f.key + '" aria-selected="false"' +
  (f.key === 'all' ? '' : ' style="--c: var(--c-' + f.key + ')"') + '>' +
  '<i class="fa-solid ' + f.icon + '"></i>' + esc(f.label) + ' <span class="n">' + f.n + '</span></button>'
).join('');
$$('#filters .chip').forEach(chip => chip.addEventListener('click', () => {
  state.domain = chip.dataset.domain;
  state.page = 1;
  renderProjects();
}));

function matching() {
  const q = state.q.toLowerCase();
  return PROJECTS.filter(p =>
    (state.domain === 'all' || p.domain === state.domain) &&
    (!q || [p.title, p.summary, p.tags.join(' '), DOMAINS[p.domain].label].join(' ').toLowerCase().includes(q))
  );
}

function syncURL() {
  const params = new URLSearchParams();
  if (state.domain !== 'all') params.set('domain', state.domain);
  if (state.q) params.set('q', state.q);
  if (state.page > 1) params.set('page', state.page);
  const qs = params.toString();
  history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
}

function renderProjects(scroll) {
  const list = matching();
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  state.page = Math.min(Math.max(1, state.page), pages);
  const start = (state.page - 1) * PER_PAGE;
  const slice = list.slice(start, start + PER_PAGE);

  $$('#filters .chip').forEach(c => c.setAttribute('aria-selected', String(c.dataset.domain === state.domain)));

  const grid = $('#projectGrid');
  grid.innerHTML = slice.length
    ? slice.map((p, i) => cardHTML(p, i, state.q)).join('')
    : '<div class="empty"><i class="fa-solid fa-magnifying-glass"></i>No projects match “' + esc(state.q) + '”.' +
      '<br><button class="btn btn-ghost" type="button" id="clearSearch">Clear filters</button></div>';
  const clear = $('#clearSearch');
  if (clear) clear.addEventListener('click', () => { state.q = ''; state.domain = 'all'; $('#projSearch').value = ''; renderProjects(); });

  const scope = state.domain === 'all' ? 'all domains' : DOMAINS[state.domain].label;
  $('#resultInfo').textContent = list.length
    ? 'Showing ' + (start + 1) + '–' + (start + slice.length) + ' of ' + plural(list.length, 'project') + ' in ' + scope + (state.q ? ' matching “' + state.q + '”' : '')
    : '';

  const pager = $('#pager');
  pager.hidden = pages <= 1;
  if (pages > 1) {
    let html = '<button type="button" data-page="' + (state.page - 1) + '"' + (state.page === 1 ? ' disabled' : '') + ' aria-label="Previous page"><i class="fa-solid fa-chevron-left"></i></button>';
    for (let n = 1; n <= pages; n++) {
      html += '<button type="button" data-page="' + n + '"' + (n === state.page ? ' aria-current="page"' : '') + ' aria-label="Page ' + n + '">' + n + '</button>';
    }
    html += '<button type="button" data-page="' + (state.page + 1) + '"' + (state.page === pages ? ' disabled' : '') + ' aria-label="Next page"><i class="fa-solid fa-chevron-right"></i></button>';
    pager.innerHTML = html;
    $$('button', pager).forEach(b => b.addEventListener('click', () => {
      state.page = Number(b.dataset.page);
      renderProjects(true);
    }));
  }

  if (scroll) $('.all-projects').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  syncURL();
}

let searchTimer;
$('#projSearch').addEventListener('input', e => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.q = e.target.value.trim();
    state.page = 1;
    renderProjects();
  }, 120);
});

// Restore filters from a shared link, e.g. ?domain=networking&q=fortigate
(function initFromURL() {
  const params = new URLSearchParams(location.search);
  const d = params.get('domain');
  if (d && DOMAINS[d]) state.domain = d;
  state.q = params.get('q') || '';
  state.page = Number(params.get('page')) || 1;
  $('#projSearch').value = state.q;
  renderProjects();
})();

/* ── Certifications ─────────────────────────── */
$('#certGrid').innerHTML = CERTS.map(c =>
  '<a class="cert-card reveal" href="' + esc(c.url) + '" target="_blank" rel="noopener">' +
    '<span class="cert-logo"><img src="' + esc(c.logo) + '" alt="' + esc(c.issuer) + ' logo" loading="lazy"/></span>' +
    '<span><h3>' + esc(c.name) + '</h3><p>' + esc(c.issuer) + '</p></span>' +
    '<i class="fa-solid fa-arrow-up-right-from-square verify" aria-hidden="true"></i>' +
  '</a>'
).join('');

/* ── Header, progress, active section, back-to-top ── */
const header = $('.site-header');
const bar = $('#progress');
const toTop = $('#toTop');
function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 8);
  const max = root.scrollHeight - window.innerHeight;
  bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
  toTop.classList.toggle('visible', y > 700);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

const navLinks = $$('.nav a');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach(a => { const s = $(a.getAttribute('href')); if (s) sectionObserver.observe(s); });

// Mobile menu
const menuBtn = $('.menu-btn');
const nav = $('#nav');
function setMenu(open) {
  nav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.innerHTML = '<i class="fa-solid fa-' + (open ? 'xmark' : 'bars') + '"></i>';
}
menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
navLinks.forEach(a => a.addEventListener('click', () => setMenu(false)));

/* ── Reveal on scroll ───────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add('visible');
    revealObserver.unobserve(el);
    // Drop the reveal transition afterwards so hover effects keep their own timing
    el.addEventListener('transitionend', () => el.classList.remove('reveal', 'visible'), { once: true });
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
$$('.reveal').forEach(el => revealObserver.observe(el));

/* ── Command palette (Ctrl/⌘ + K) ───────────── */
const palette = $('#palette');
const pInput = $('#paletteInput');
const pList = $('#paletteList');
const go = id => () => $(id).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
const open = url => () => window.open(url, '_blank', 'noopener');

const commands = [
  { group: 'Navigate', label: 'About', icon: 'fa-user', run: go('#about') },
  { group: 'Navigate', label: 'Skills', icon: 'fa-screwdriver-wrench', run: go('#skills') },
  { group: 'Navigate', label: 'Projects', icon: 'fa-layer-group', run: go('#projects') },
  { group: 'Navigate', label: 'Certifications', icon: 'fa-certificate', run: go('#certifications') },
  { group: 'Navigate', label: 'Contact', icon: 'fa-paper-plane', run: go('#contact') },
  { group: 'Actions', label: 'Toggle light / dark mode', icon: 'fa-circle-half-stroke', run: toggleTheme },
  { group: 'Actions', label: 'Copy email address', icon: 'fa-copy', run: copyEmail },
  { group: 'Actions', label: 'Download CV', icon: 'fa-file-arrow-down', run: open(LINKS.cv) },
  { group: 'Actions', label: 'Open LinkedIn', icon: 'fa-brands fa-linkedin-in', run: open(LINKS.linkedin) },
  { group: 'Actions', label: 'Open GitHub', icon: 'fa-brands fa-github', run: open(LINKS.github) }
].concat(Object.keys(DOMAINS).map(k => ({
  group: 'Filter projects', label: 'Show ' + DOMAINS[k].label + ' projects', icon: DOMAINS[k].icon, domain: k,
  run: () => { state.domain = k; state.q = ''; state.page = 1; $('#projSearch').value = ''; renderProjects(); go('#projects')(); }
}))).concat(PROJECTS.map(p => ({
  group: 'Projects', label: p.title, icon: DOMAINS[p.domain].icon, domain: p.domain,
  keywords: p.tags.join(' ') + ' ' + p.summary, hint: DOMAINS[p.domain].label, run: open(p.url)
})));

let pResults = [], pIndex = 0;
function renderPalette() {
  const q = pInput.value.trim().toLowerCase();
  pResults = commands.filter(c => !q || (c.label + ' ' + (c.keywords || '') + ' ' + c.group).toLowerCase().includes(q));
  if (!q) pResults = pResults.filter(c => c.group !== 'Projects').concat(pResults.filter(c => c.group === 'Projects').slice(0, 5));
  pIndex = Math.min(pIndex, Math.max(0, pResults.length - 1));
  if (!pResults.length) { pList.innerHTML = '<li class="palette-empty">No results for “' + esc(q) + '”</li>'; return; }
  let html = '', lastGroup = '';
  pResults.forEach((c, i) => {
    if (c.group !== lastGroup) { html += '<li class="palette-group" role="presentation">' + c.group + '</li>'; lastGroup = c.group; }
    const iconClass = c.icon.startsWith('fa-brands') ? c.icon : 'fa-solid ' + c.icon;
    html += '<li class="palette-item" role="option" id="pi-' + i + '" data-i="' + i + '" aria-selected="' + (i === pIndex) + '"' +
      (c.domain ? ' style="--c: var(--c-' + c.domain + ')"' : '') + '>' +
      '<i class="' + iconClass + '"></i><span>' + esc(c.label) + '</span>' +
      (c.hint ? '<span class="hint">' + esc(c.hint) + '</span>' : '') + '</li>';
  });
  pList.innerHTML = html;
  pInput.setAttribute('aria-activedescendant', 'pi-' + pIndex);
  const sel = $('#pi-' + pIndex);
  if (sel) sel.scrollIntoView({ block: 'nearest' });
}
function openPalette() {
  if (palette.open) return;
  pInput.value = '';
  pIndex = 0;
  renderPalette();
  palette.showModal();
  pInput.focus();
}
function runCommand(i) {
  const c = pResults[i];
  if (!c) return;
  palette.close();
  c.run();
}
pInput.addEventListener('input', () => { pIndex = 0; renderPalette(); });
pInput.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { e.preventDefault(); pIndex = (pIndex + 1) % pResults.length; renderPalette(); }
  if (e.key === 'ArrowUp') { e.preventDefault(); pIndex = (pIndex - 1 + pResults.length) % pResults.length; renderPalette(); }
  if (e.key === 'Enter') { e.preventDefault(); runCommand(pIndex); }
});
pList.addEventListener('click', e => { const li = e.target.closest('.palette-item'); if (li) runCommand(Number(li.dataset.i)); });
pList.addEventListener('mousemove', e => {
  const li = e.target.closest('.palette-item');
  if (li && Number(li.dataset.i) !== pIndex) { pIndex = Number(li.dataset.i); renderPalette(); }
});
palette.addEventListener('click', e => { if (e.target === palette) palette.close(); });
$$('[data-open-palette]').forEach(b => b.addEventListener('click', openPalette));

document.addEventListener('keydown', e => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette.open ? palette.close() : openPalette(); }
  else if (e.key === '/' && !typing && !palette.open) { e.preventDefault(); $('#projSearch').focus({ preventScroll: true }); $('.all-projects').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }
  else if (e.key === 'Escape' && document.activeElement === $('#projSearch')) { $('#projSearch').value = ''; state.q = ''; renderProjects(); $('#projSearch').blur(); }
});

// Show ⌘ instead of Ctrl on Apple devices
if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
  $$('kbd').forEach(k => { k.textContent = k.textContent.replace('Ctrl', '⌘'); });
}
