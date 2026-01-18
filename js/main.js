// js/main.js - copy from previous response
// main.js

// Note: Import assumes ES modules; if not supported, use <script src> without type="module"

gsap.registerPlugin(ScrollTrigger);

// =============================================
//  Theme handling
// =============================================
const themeToggle = document.querySelector('.theme-toggle');
const currentTheme = localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

document.documentElement.setAttribute('data-theme', currentTheme);

if (themeToggle) {
  themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

  themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';

    // lichte animatie op hele pagina
    gsap.to('body', {
      opacity: 0.4,
      duration: 0.4,
      onComplete: () => gsap.to('body', { opacity: 1, duration: 0.8 })
    });
  });
}

// =============================================
//  Hamburger menu
// =============================================
const hamburger = document.querySelector('.hamburger');
const navUl = document.querySelector('nav ul');

if (hamburger && navUl) {
  hamburger.addEventListener('click', () => {
    navUl.classList.toggle('show');
    hamburger.textContent = navUl.classList.contains('show') ? '✕' : '☰';
  });
}

// =============================================
//  Back to top
// =============================================
const backToTop = document.createElement('button');
backToTop.id = 'back-to-top';
backToTop.innerHTML = '↑';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 600);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =============================================
//  Geavanceerde sneeuw simulatie met GSAP
// =============================================
function createSnowflakes(count = 80) {
  const container = document.querySelector('.snow-container') ||
    document.createElement('div');
  container.className = 'snow-container';
  document.querySelector('header')?.prepend(container);

  for (let i = 0; i < count; i++) {
    const flake = document.createElement('div');
    flake.className = 'snowflake';

    const size = gsap.utils.random(4, 14, 1);
    const duration = gsap.utils.random(12, 28, 0.5);
    const delay = gsap.utils.random(0, 8);

    gsap.set(flake, {
      width: size,
      height: size,
      x: gsap.utils.random(-100, window.innerWidth + 100),
      y: -size * 2,
      opacity: gsap.utils.random(0.5, 0.95),
      '--drift': gsap.utils.random(-80, 80) + 'vw'
    });

    container.appendChild(flake);

    gsap.to(flake, {
      y: '120dvh',
      x: '+=random(-120,120)',
      rotation: '+=720',
      opacity: 0,
      duration: duration,
      delay: delay,
      ease: "none",
      onComplete: () => {
        flake.remove();
        createSnowflakes(1); // oneindig nieuwe
      }
    });
  }
}

if (document.querySelector('header')) {
  createSnowflakes(60);
  setInterval(() => createSnowflakes(2), 1800);
}

// =============================================
//  GSAP Animaties & ScrollTrigger
// =============================================

// Hero tekst
gsap.to('header h1', {
  y: 0,
  scale: 1,
  opacity: 1,
  duration: 1.8,
  ease: "back.out(1.4)"
});

gsap.to('.hero-bg', {
  scale: 1,
  duration: 20,
  ease: "none",
  scrollTrigger: {
    trigger: '.hero',
    start: "top top",
    end: "bottom top",
    scrub: 1.2
  }
});

gsap.to('.hero h2', {
  y: 0,
  opacity: 1,
  duration: 2.2,
  ease: "power4.out",
  delay: 0.6
});

// Secties & cards
gsap.utils.toArray('section h2').forEach((el, i) => {
  gsap.from(el, {
    y: 120,
    opacity: 0,
    duration: 1.4,
    ease: "power4.out",
    scrollTrigger: {
      trigger: el,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });
});

gsap.utils.toArray('.card').forEach((card, i) => {
  gsap.from(card, {
    y: 140,
    scale: 0.92,
    opacity: 0,
    duration: 1.3,
    ease: "power3.out",
    delay: i * 0.12,
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
      toggleActions: "play none none reverse"
    }
  });

  // 3D hover tilt
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(card, {
      rotationY: x / 18,
      rotationX: -y / 18,
      transformPerspective: 900,
      ease: "power2.out",
      duration: 0.6
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.9,
      ease: "elastic.out(1, 0.4)"
    });
  });
});

// =============================================
//  Smooth scroll voor interne links
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
