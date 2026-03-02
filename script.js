document.getElementById('yr').textContent = new Date().getFullYear();

// Theme toggle
const btn = document.getElementById('themeBtn');
btn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  btn.innerHTML = document.body.classList.contains('dark')
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
});

// Active nav on scroll
const navLinks = document.querySelectorAll('.nav-item[href^="#"]');
const sections = [...navLinks].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
window.addEventListener('scroll', () => {
  let cur = sections[0];
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) cur = s; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur.id));
}, { passive: true });

// Pagination
const PER = 6;
const state = { cloud: { cur: 1 }, devops: { cur: 1 } };

function render(key) {
  const items = [...document.querySelectorAll('#' + key + '-list li')];
  const total = Math.max(1, Math.ceil(items.length / PER));
  const cur   = state[key].cur;
  const start = (cur - 1) * PER;
  items.forEach((el, i) => el.classList.toggle('show', i >= start && i < start + PER));
  document.getElementById(key + '-info').textContent = 'Page ' + cur + ' of ' + total;
  document.getElementById(key + '-prev').disabled = cur === 1;
  document.getElementById(key + '-next').disabled = cur === total;
}

window.pg = function(key, dir) {
  const items = document.querySelectorAll('#' + key + '-list li');
  const total = Math.max(1, Math.ceil(items.length / PER));
  state[key].cur = Math.min(Math.max(1, state[key].cur + dir), total);
  render(key);
};

['cloud', 'devops'].forEach(render);

// Fade in on scroll
const io = new IntersectionObserver(entries =>
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }),
  { threshold: 0.07 }
);
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
