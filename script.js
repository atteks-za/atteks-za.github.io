const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.getElementById('yr').textContent = new Date().getFullYear();

// ── Theme: follows the OS until the visitor picks one, then remembers it ──
const themeBtns = document.querySelectorAll('.theme-toggle');
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
function savedTheme() { try { return localStorage.getItem('theme'); } catch (e) { return null; } }
function applyTheme(theme) {
  root.classList.toggle('dark', theme === 'dark');
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  themeBtns.forEach(b => {
    b.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    b.title = label;
    b.setAttribute('aria-label', label);
  });
  document.querySelector('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#060d1f' : '#ffffff');
}
applyTheme(root.classList.contains('dark') ? 'dark' : 'light');
themeBtns.forEach(b => b.addEventListener('click', () => {
  const next = root.classList.contains('dark') ? 'light' : 'dark';
  try { localStorage.setItem('theme', next); } catch (e) {}
  applyTheme(next);
}));
darkQuery.addEventListener('change', e => { if (!savedTheme()) applyTheme(e.matches ? 'dark' : 'light'); });
// Enable colour transitions only after first paint, so the page never animates in from the wrong theme
requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('theme-ready')));

// ── Counts: sidebar badges, section pills, hero stats ──
const KEYS = ['cloud', 'networks', 'cyber', 'devops', 'admin'];
const itemsFor = key => [...document.querySelectorAll('#' + key + '-list li')];
const plural = (n, word) => n + ' ' + word + (n === 1 ? '' : 's');

const counts = { certs: document.querySelectorAll('.cert-grid li').length };
KEYS.forEach(key => {
  const n = counts[key] = itemsFor(key).length;
  document.querySelector('#' + key + ' .section-tag')
    .insertAdjacentHTML('beforeend', '<span class="count-pill">' + plural(n, 'project') + '</span>');
});
Object.keys(counts).forEach(key => {
  const nav = document.querySelector('.nav-item[href="#' + key + '"]');
  if (nav) nav.insertAdjacentHTML('beforeend', '<span class="nav-count">' + counts[key] + '</span>');
});

const stats = {
  projects: KEYS.reduce((sum, k) => sum + counts[k], 0),
  domains: KEYS.length,
  certs: counts.certs
};
document.querySelectorAll('[data-stat]').forEach(el => {
  const target = stats[el.dataset.stat];
  if (reduceMotion) { el.textContent = target; return; }
  const t0 = performance.now(), dur = 1100;
  (function tick(now) {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
});

// ── Pagination (9 per page) + search ──
const PER = 9;
const page = {};
KEYS.forEach(k => page[k] = 1);
let query = '';
const matches = li => !query || li.textContent.toLowerCase().includes(query);

function render(key) {
  const all = itemsFor(key);
  const visible = all.filter(matches);
  const total = Math.max(1, Math.ceil(visible.length / PER));
  page[key] = Math.min(page[key], total);
  const cur = page[key], start = (cur - 1) * PER;

  all.forEach(li => li.classList.remove('show'));
  visible.slice(start, start + PER).forEach((li, i) => {
    li.style.setProperty('--i', i);
    li.classList.add('show');
  });

  const prev = document.getElementById(key + '-prev');
  const next = document.getElementById(key + '-next');
  prev.parentElement.hidden = total <= 1;
  prev.disabled = cur === 1;
  next.disabled = cur === total;

  const info = document.getElementById(key + '-info');
  info.innerHTML = '';
  for (let p = 1; p <= total; p++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pag-num' + (p === cur ? ' active' : '');
    b.textContent = p;
    b.setAttribute('aria-label', 'Page ' + p);
    if (p === cur) b.setAttribute('aria-current', 'page');
    b.addEventListener('click', () => goTo(key, p));
    info.appendChild(b);
  }

  const list = document.getElementById(key + '-list');
  let empty = list.parentElement.querySelector('.no-results');
  if (!empty) {
    empty = document.createElement('p');
    empty.className = 'no-results';
    empty.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> No matching projects in this domain';
    list.after(empty);
  }
  empty.hidden = visible.length > 0;
  return visible.length;
}

function goTo(key, p) {
  page[key] = p;
  render(key);
  const list = document.getElementById(key + '-list');
  if (list.getBoundingClientRect().top < 0) {
    document.getElementById(key).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }
}
window.pg = (key, dir) => goTo(key, page[key] + dir);
KEYS.forEach(render);

const search = document.getElementById('projSearch');
const searchInfo = document.getElementById('searchInfo');
search.addEventListener('input', () => {
  query = search.value.trim().toLowerCase();
  let found = 0;
  KEYS.forEach(k => { page[k] = 1; found += render(k); });
  searchInfo.textContent = query ? plural(found, 'matching project') : '';
});
document.addEventListener('keydown', e => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
  if (e.key === '/' && !typing) { e.preventDefault(); search.focus(); }
  if (e.key === 'Escape' && document.activeElement === search) {
    search.value = '';
    search.dispatchEvent(new Event('input'));
    search.blur();
  }
});

// ── Scroll: active nav, progress bar, back-to-top ──
const navLinks = document.querySelectorAll('.nav-item[href^="#"]');
const sections = [...navLinks].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const bar = document.getElementById('progress');
const toTop = document.getElementById('toTop');
function onScroll() {
  let cur = sections[0];
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) cur = s; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur.id));

  const max = root.scrollHeight - window.innerHeight;
  bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
  toTop.classList.toggle('visible', window.scrollY > 600);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

// ── Fade in on scroll ──
const io = new IntersectionObserver(entries =>
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } }),
  { threshold: 0.07 }
);
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
