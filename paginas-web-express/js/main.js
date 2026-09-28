// =========================================
// PÁGINAS WEB EXPRESS — Interacciones y animaciones
// =========================================

// Año automático en el pie de página
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Menú: fondo al hacer scroll ----------
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ---------- Menú móvil ----------
const toggle = document.getElementById('nav-toggle');
const menu = document.getElementById('menu');

toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

// Si la persona prefiere menos movimiento, no animamos
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 720px)').matches;

// ---------- Fondo de partículas ----------
if (window.particlesJS && !reduceMotion) {
  particlesJS('particles-js', {
    particles: {
      number: { value: isMobile ? 25 : 60, density: { enable: true, value_area: 900 } },
      color: { value: '#9fb0ff' },
      shape: { type: 'circle' },
      opacity: { value: 0.35 },
      size: { value: 2.2, random: true },
      line_linked: { enable: true, distance: 140, color: '#6f86ff', opacity: 0.18, width: 1 },
      move: { enable: true, speed: 1, out_mode: 'out' }
    },
    interactivity: {
      detect_on: 'window',
      events: { onhover: { enable: !isMobile, mode: 'grab' }, onclick: { enable: false }, resize: true },
      modes: { grab: { distance: 160, line_linked: { opacity: 0.45 } } }
    },
    retina_detect: true
  });
}

// ---------- Animaciones con GSAP ----------
if (window.gsap && !reduceMotion) {
  gsap.registerPlugin(ScrollTrigger);

  const dayEl = document.getElementById('build-day');
  const statusEl = document.getElementById('build-status');
  const progressEl = document.getElementById('build-progress');

  // Estado inicial de la "página en construcción"
  gsap.set('.mock', { opacity: 0, y: 10 });
  gsap.set('#build-fill', { width: '0%' });
  dayEl.textContent = '1';
  statusEl.textContent = 'Diseño';
  progressEl.classList.remove('done');

  // La página se construye del día 1 al 7
  function buildSite() {
    const counter = { day: 1 };
    const t = gsap.timeline();
    t.to('#build-fill', { width: '100%', duration: 3.2, ease: 'none' }, 0)
     .to(counter, {
       day: 7, duration: 3.2, ease: 'none',
       onUpdate: () => { dayEl.textContent = Math.round(counter.day); }
     }, 0)
     .to('.mock', { opacity: 1, y: 0, duration: 0.5, stagger: 0.35, ease: 'power2.out' }, 0.1)
     .call(() => { statusEl.textContent = 'Construcción'; }, null, 1.1)
     .call(() => { statusEl.textContent = 'Revisión'; }, null, 2.4)
     .call(() => {
       statusEl.innerHTML = '<i class="fa-solid fa-check"></i> Publicada';
       progressEl.classList.add('done');
     }, null, 3.2);
    return t;
  }

  // Secuencia de entrada del hero
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .from('.hero-title .line > span', { yPercent: 110, duration: 0.8, stagger: 0.12 })
    .from('.hero-sub', { y: 16, opacity: 0, duration: 0.6 }, '-=0.4')
    .from('.hero-actions .btn', { y: 12, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
    .from('.hero-note', { opacity: 0, duration: 0.4 }, '-=0.2')
    .from('.browser', { y: 30, opacity: 0, duration: 0.8 }, 0.3)
    .add(buildSite(), 0.9);

  // Servicios: aparecen al llegar a la sección
  gsap.from('.service', {
    scrollTrigger: { trigger: '.services-grid', start: 'top 80%' },
    y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out'
  });

  // Línea de tiempo: la línea se dibuja mientras haces scroll
  gsap.from('.timeline-rail', {
    scaleY: 0, transformOrigin: 'top', ease: 'none',
    scrollTrigger: { trigger: '.timeline-wrap', start: 'top 70%', end: 'bottom 60%', scrub: true }
  });
}
