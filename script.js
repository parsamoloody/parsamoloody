const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktopPointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth > 850;

// Accessible mobile navigation
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

function setMenu(open) {
  if (!menuButton || !mobileMenu) return;
  menuButton.classList.toggle('active', open);
  mobileMenu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  mobileMenu.setAttribute('aria-hidden', String(!open));
}

menuButton?.addEventListener('click', () => {
  setMenu(!mobileMenu?.classList.contains('open'));
});

mobileLinks.forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

window.addEventListener('pageshow', () => setMenu(false));

// Reveal content when it enters the viewport
const revealItems = document.querySelectorAll('.reveal');

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px' });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 3, 2) * 60}ms`;
    revealObserver.observe(item);
  });
}

// Header state, progress bar, and active navigation
const header = document.querySelector('.site-header');
const progressBar = document.querySelector('.scroll-progress span');
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.desktop-nav a');
let scrollTicking = false;

function updateScrollUI() {
  const scrollTop = window.scrollY;
  header?.classList.toggle('scrolled', scrollTop > 20);
  if (progressBar) {
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    progressBar.style.width = `${Math.min((scrollTop / scrollable) * 100, 100)}%`;
  }
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(updateScrollUI);
}, { passive: true });

updateScrollUI();

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-38% 0px -56%', threshold: 0 });

  sections.forEach((section) => sectionObserver.observe(section));
}

// Soft RGB cursor lighting only on desktop devices with a precise pointer
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow && isDesktopPointer() && !reduceMotion) {
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let glowX = pointerX;
  let glowY = pointerY;
  let glowRunning = true;

  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
  }, { passive: true });

  const moveGlow = () => {
    if (!glowRunning) return;
    glowX += (pointerX - glowX) * 0.12;
    glowY += (pointerY - glowY) * 0.12;
    cursorGlow.style.transform = `translate3d(${glowX - 260}px, ${glowY - 260}px, 0)`;
    requestAnimationFrame(moveGlow);
  };

  requestAnimationFrame(moveGlow);
}

// Count GitHub highlights once the stats section is visible
const counters = document.querySelectorAll('.counter');
if (counters.length > 0) {
  if (reduceMotion || !('IntersectionObserver' in window)) {
    counters.forEach((counter) => { counter.textContent = counter.dataset.target; });
  } else {
    let animated = false;
    const startCounters = () => {
      if (animated) return;
      animated = true;
      counters.forEach((counter) => {
        const target = Number(counter.dataset.target || 0);
        const duration = 900;
        const start = performance.now();

        const updateCounter = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = String(Math.round(target * eased));
          if (progress < 1) requestAnimationFrame(updateCounter);
        };

        requestAnimationFrame(updateCounter);
      });
    };

    const statsObserver = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        startCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.1 });

    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) {
      statsObserver.observe(statsEl);
    } else {
      startCounters();
    }
  }
}

// Subtle depth on project cards only on desktop
if (isDesktopPointer() && !reduceMotion) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.transform = `perspective(1400px) rotateX(${-y * 1.3}deg) rotateY(${x * 1.3}deg)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

const year = document.querySelector('#year');
if (year) {
  const isPersian = document.documentElement.lang === 'fa';
  const currentYear = new Date().getFullYear();
  year.textContent = isPersian ? currentYear.toLocaleString('fa-IR', { useGrouping: false }) : currentYear;
}

// Persist language selection on switcher clicks
document.querySelectorAll('.lang-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    if (lang) {
      try {
        localStorage.setItem('preferred_language', lang);
      } catch (e) {}
    }
  });
});

