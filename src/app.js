window.addEventListener('load', () => {
  window.setTimeout(() => document.body.classList.add('page-ready'), 1200);
});

const liveClock = document.querySelector('.live-clock');
const updateClock = () => {
  const time = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Makassar',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date());
  liveClock.textContent = `Waktu NTT — ${time}`;
  document.querySelector('#nav-clock').textContent = time.slice(0, 5);
};
updateClock();
window.setInterval(updateClock, 1000);

const foods = [
  {name:'Se’i Sapi', place:'Kupang, Timor', text:'Irisan daging asap dengan aroma kayu khas yang menggoda.'},
  {name:'Jagung Bose', place:'Timor Tengah', text:'Bubur jagung tradisional, hangat, gurih, dan mengenyangkan.'},
  {name:'Kolo', place:'Manggarai, Flores', text:'Nasi bambu aromatik yang dimasak dengan cara istimewa.'}
];

document.querySelector('#katalog').innerHTML = foods.map((food, index) => `
  <article class="food-card">
    <div class="food-img"></div>
    <div class="food-info"><small>${food.place}</small><h3>${food.name}</h3><p>${food.text}</p></div>
  </article>
`).join('');

document.querySelector('.menu-btn').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('show');
});

const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('citra-rasa-theme');
if (savedTheme === 'dark') document.body.classList.add('dark-mode');

const updateThemeButton = () => {
  const darkMode = document.body.classList.contains('dark-mode');
  themeToggle.setAttribute('aria-pressed', darkMode);
  themeToggle.setAttribute('aria-label', darkMode ? 'Aktifkan mode terang' : 'Aktifkan mode malam');
  themeToggle.querySelector('.theme-icon').textContent = darkMode ? '☀' : '☾';
};

updateThemeButton();
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('citra-rasa-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  updateThemeButton();
});

const revealItems = document.querySelectorAll('.food-card, .region, .story-image, .story-copy, .quick > div');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach((item) => revealObserver.observe(item));

const parallaxItems = [
  ...document.querySelectorAll('.hero-copy, .hero-art, .quick, .discover, .regions .container, .recipe-section, .gallery-section .container, .story-image, .story-copy, .contact-grid, footer')
];

let parallaxTicking = false;
const updateParallax = () => {
  const viewportCenter = window.innerHeight / 2;
  parallaxItems.forEach((item, index) => {
    const bounds = item.getBoundingClientRect();
    if (bounds.bottom < -120 || bounds.top > window.innerHeight + 120) return;
    const distance = (bounds.top + bounds.height / 2 - viewportCenter) * -0.035;
    const limit = item.classList.contains('hero-art') ? 18 : 12;
    const offset = Math.max(-limit, Math.min(limit, distance));
    item.style.setProperty('--parallax-y', `${offset}px`);
    item.style.setProperty('--parallax-delay', `${(index % 3) * 0.02}s`);
  });
  parallaxTicking = false;
};

const requestParallax = () => {
  if (!parallaxTicking) {
    window.requestAnimationFrame(updateParallax);
    parallaxTicking = true;
  }
};

window.addEventListener('scroll', requestParallax, { passive: true });
window.addEventListener('resize', requestParallax);
requestParallax();
