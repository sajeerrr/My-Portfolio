/* =====================================================
   ANIMATIONS.JS — Entrance Animations & Visual Effects
   ===================================================== */

'use strict';

/* ==================== INTERSECTION OBSERVER ==================== */
(function initIntersectionObserver() {
  const animatables = document.querySelectorAll(
    '.fade-up, .fade-left, .fade-right, .scale-in'
  );

  if (!animatables.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  animatables.forEach((el) => observer.observe(el));
})();

/* ==================== SKILL BAR ANIMATION ==================== */
(function initSkillBars() {
  const bars = document.querySelectorAll('.bar-fill');

  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute('data-width');
          bar.style.width = width + '%';
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach((bar) => observer.observe(bar));
})();

/* ==================== COUNTER ANIMATION ==================== */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');

  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 1200;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = target;
          }
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    },
    { threshold: 0.8 }
  );

  counters.forEach((el) => observer.observe(el));
})();

/* ==================== HERO MOUSE GLOW ==================== */
(function initHeroGlow() {
  const glow = document.getElementById('hero-glow');
  const hero = document.querySelector('.hero');

  if (!glow || !hero) return;

  let animFrame;
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  hero.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  hero.addEventListener('mouseleave', () => {
    targetX = window.innerWidth / 2;
    targetY = window.innerHeight / 2;
  });

  function animate() {
    // Smooth lerp
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;

    glow.style.left = currentX + 'px';
    glow.style.top = currentY + 'px';

    animFrame = requestAnimationFrame(animate);
  }

  animate();
})();

/* ==================== TYPING EFFECT ==================== */
(function initTypingEffect() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'AI-powered solutions.',
    'scalable backends.',
    'intelligent systems.',
    'RAG pipelines.',
    'FastAPI services.',
    'LLM applications.',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let pauseTimer = null;

  const TYPING_SPEED = 65;
  const DELETING_SPEED = 35;
  const PAUSE_AFTER_TYPE = 2200;
  const PAUSE_AFTER_DELETE = 400;

  function type() {
    const current = phrases[phraseIdx];

    if (isDeleting) {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
    }

    // Decide next action
    if (!isDeleting && charIdx === current.length) {
      // Finished typing → pause, then delete
      pauseTimer = setTimeout(() => {
        isDeleting = true;
        type();
      }, PAUSE_AFTER_TYPE);
      return;
    }

    if (isDeleting && charIdx === 0) {
      // Finished deleting → move to next phrase
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      pauseTimer = setTimeout(type, PAUSE_AFTER_DELETE);
      return;
    }

    const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED;
    pauseTimer = setTimeout(type, speed);
  }

  // Start after a short delay (loader finishes)
  setTimeout(type, 1800);
})();

/* ==================== MAGNETIC BUTTONS ==================== */
(function initMagneticButtons() {
  const buttons = document.querySelectorAll('.magnetic');

  if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on touch

  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.28;
      const dy = (e.clientY - cy) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ==================== CARD MOUSE GLOW (skill cards) ==================== */
(function initCardGlow() {
  const cards = document.querySelectorAll('.skill-card');

  if (window.matchMedia('(pointer: coarse)').matches) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
})();

/* ==================== PROJECT CARD TILT ==================== */
(function initTilt() {
  const cards = document.querySelectorAll('.project-card-featured');

  if (window.matchMedia('(pointer: coarse)').matches) return;

  const MAX_TILT = 4; // degrees

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = -y * MAX_TILT;
      const rotateY = x * MAX_TILT;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
