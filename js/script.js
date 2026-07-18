/* =====================================================
   SCRIPT.JS — Core Interactions
   ===================================================== */

'use strict';

/* ==================== LOADER ==================== */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  function hideLoader() {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // Hide loader after animations complete
  window.addEventListener('load', () => {
    setTimeout(hideLoader, 1500);
  });

  // Prevent scroll while loading
  document.body.style.overflow = 'hidden';
  setTimeout(hideLoader, 2500);
})();

/* ==================== SCROLL PROGRESS ==================== */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
})();

/* ==================== NAVBAR SCROLL ==================== */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run on init
})();

/* ==================== ACTIVE NAV LINK ==================== */
(function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + id
            );
          });
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: '-60px 0px -40% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
})();

/* ==================== SMOOTH SCROLL ==================== */
(function initSmoothScroll() {
  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
    10
  ) || 68;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ==================== HAMBURGER MENU ==================== */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!hamburger || !mobileMenu) return;

  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Close when a link is clicked
  mobileMenu.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      toggleMenu(false);
      hamburger.focus();
    }
  });
})();

/* ==================== PROJECT FILTER ==================== */
(function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const featuredCards = document.querySelectorAll('.project-card-featured');
  const otherCards = document.querySelectorAll('.project-card-sm');

  if (!filterBtns.length) return;

  const allCards = [...featuredCards, ...otherCards];

  function filterProjects(filter) {
    allCards.forEach((card) => {
      const categories = card.getAttribute('data-category') || '';
      const show = filter === 'all' || categories.includes(filter);

      if (show) {
        card.classList.remove('project-hidden');
        card.style.animation = 'fade-up-in 0.4s cubic-bezier(0.4,0,0.2,1) forwards';
      } else {
        card.classList.add('project-hidden');
        card.style.animation = '';
      }
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects(btn.getAttribute('data-filter'));
    });
  });
})();

/* ==================== BACK TO TOP ==================== */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener(
    'scroll',
    () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    },
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ==================== KEYBOARD FOCUS STYLES ==================== */
(function initFocusVisibility() {
  // Add "keyboard" class on Tab, remove on mouse click
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
})();

/* ==================== LAZY IMAGES ==================== */
(function initLazyImages() {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  if (!('IntersectionObserver' in window) || !imgs.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        observer.unobserve(img);
      }
    });
  });

  imgs.forEach((img) => observer.observe(img));
})();
