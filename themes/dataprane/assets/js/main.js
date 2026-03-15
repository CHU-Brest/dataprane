// ─── Dark / Light mode ───────────────────────────────────────
const toggleBtn  = document.getElementById('theme-toggle');
const iconSun    = document.getElementById('icon-sun');
const iconMoon   = document.getElementById('icon-moon');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (theme === 'dark') {
    iconSun.style.display  = 'block';
    iconMoon.style.display = 'none';
  } else {
    iconSun.style.display  = 'none';
    iconMoon.style.display = 'block';
  }
}

// Init icon state from stored theme
const stored = localStorage.getItem('theme')
  || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(stored);

toggleBtn?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ─── Search (basic client-side filter) ───────────────────────
const searchInput = document.getElementById('search-input');

searchInput?.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  const cards = document.querySelectorAll('.post-card');
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = (!q || text.includes(q)) ? '' : 'none';
  });
});
