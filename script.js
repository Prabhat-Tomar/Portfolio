/* ================================================
   PRABHAT TOMAR — Portfolio v2 Script
   Dark Mode · Scroll Curtain · Reveal · Nav
   ================================================ */

// ---- Dark Mode ----
const html = document.documentElement;
const darkBtn = document.getElementById('darkToggle');

const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

darkBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ---- Nav scroll state ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ---- Mobile menu ----
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ---- Scroll Reveal ----
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// Hero reveals on load
window.addEventListener('load', () => {
  document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('visible'));
});

// ---- Profile image fallback ----
const profileImg = document.getElementById('profileImg');
const imgFallback = document.getElementById('imgFallback');
if (profileImg) {
  const showFallback = () => {
    profileImg.style.display = 'none';
    imgFallback.style.display = 'flex';
  };
  profileImg.addEventListener('error', showFallback);
  if (profileImg.complete && profileImg.naturalHeight === 0) showFallback();
}

// ---- Scroll Section Curtain Animation ----
// Plays a quick wipe when crossing section boundaries
const curtain = document.getElementById('scrollCurtain');
const sections = Array.from(document.querySelectorAll('section[id]'));
let lastSection = '';
let curtainCooling = false;

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      if (id !== lastSection && lastSection !== '' && !curtainCooling) {
        triggerCurtain();
        lastSection = id;
      } else {
        lastSection = id;
      }
      // Update active nav link
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

function triggerCurtain() {
  if (curtainCooling) return;
  curtainCooling = true;
  curtain.classList.add('wipe');
  curtain.addEventListener('animationend', () => {
    curtain.classList.remove('wipe');
    // Cool-down so it doesn't fire on every pixel scroll
    setTimeout(() => { curtainCooling = false; }, 900);
  }, { once: true });
}

// ---- Smooth anchor scroll with offset ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---- Hero image subtle parallax (desktop only) ----
const photoWrap = document.querySelector('.hero-photo-wrap');
if (photoWrap) {
  document.addEventListener('mousemove', e => {
    if (window.innerWidth < 768) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 14;
    const y = (e.clientY / window.innerHeight - 0.5) * 14;
    photoWrap.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
  });
}

// ---- Page entry transition ----
const pt = document.getElementById('pageTransition');
pt.classList.add('leave');
pt.addEventListener('animationend', () => pt.classList.remove('leave'), { once: true });
