// ============================================================
// PAGE LOADER
// ============================================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('pageLoader');
    if (loader) loader.classList.add('hidden');
  }, 1200);
});

// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (scrollTop / docHeight) * 100;
  if (progressBar) progressBar.style.width = pct + '%';
});

// ============================================================
// CONTACT FORM
// ============================================================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const btnText = btn.querySelector('span');
    btn.classList.add('loading');
    btnText.textContent = 'Sending...';

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        contactForm.reset();
        formSuccess.classList.add('show');
        btnText.textContent = 'Send Message';
        btn.classList.remove('loading');
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      } else {
        throw new Error();
      }
    } catch {
      btnText.textContent = 'Failed — try email';
      btn.classList.remove('loading');
      setTimeout(() => { btnText.textContent = 'Send Message'; }, 3000);
    }
  });
}

// ============================================================
// NAVBAR — scroll behavior + hamburger
// ============================================================
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ============================================================
// SCROLL REVEAL
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      siblings.forEach((el, idx) => {
        if (!el.classList.contains('visible')) {
          setTimeout(() => el.classList.add('visible'), idx * 120);
        }
      });
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================================================
// SKILL BAR ANIMATION — trigger when skills section visible
// ============================================================
const skillsSection = document.querySelector('.skills');

const skillObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.skill-fill').forEach(bar => {
      const w = getComputedStyle(bar).getPropertyValue('--w').trim();
      bar.style.width = w;
    });
    skillObserver.disconnect();
  }
}, { threshold: 0.25 });

if (skillsSection) skillObserver.observe(skillsSection);

// ============================================================
// ACTIVE NAV LINK on scroll
// ============================================================
const sections = document.querySelectorAll('section[id]');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav-link').forEach(link => {
        link.style.color = '';
        const dot = link.querySelector('::after');
      });
      const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.style.color = 'var(--accent)';
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));

// ============================================================
// SMOOTH HERO CTA scroll
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================================
// TYPING EFFECT — hero title
// ============================================================
function typewriterEffect(el, text, delay = 60) {
  el.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, delay);
}

// ============================================================
// CURSOR GLOW — subtle follow effect
// ============================================================
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position: fixed;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(84,197,248,0.04), transparent 70%);
  pointer-events: none;
  z-index: 0;
  transform: translate(-50%, -50%);
  transition: left .15s ease, top .15s ease;
`;
document.body.appendChild(cursorGlow);

window.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

// ============================================================
// PROJECT CARDS — tilt on hover
// ============================================================
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ============================================================
// COUNTER ANIMATION — hero stats
// ============================================================
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1200;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Only run counter for numeric stat numbers
const heroSection = document.querySelector('.hero');
let countersRan = false;

const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersRan) {
    countersRan = true;
    // nothing to animate — values are text, keep as-is
    heroObserver.disconnect();
  }
}, { threshold: 0.5 });

if (heroSection) heroObserver.observe(heroSection);

// ============================================================
// PARTICLES — subtle background dots for hero
// ============================================================
function createParticles() {
  const hero = document.querySelector('.hero-bg');
  if (!hero) return;

  for (let i = 0; i < 28; i++) {
    const dot = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const delay = Math.random() * 6;
    const duration = Math.random() * 8 + 6;
    dot.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(84,197,248,${Math.random() * 0.4 + 0.1});
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: particleDrift ${duration}s ${delay}s infinite ease-in-out alternate;
      pointer-events: none;
    `;
    hero.appendChild(dot);
  }
}

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes particleDrift {
    from { transform: translateY(0px) translateX(0px); opacity: .3; }
    to   { transform: translateY(-30px) translateX(10px); opacity: .9; }
  }
`, styleSheet.cssRules.length);

createParticles();

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Make hero content visible immediately
  document.querySelectorAll('.hero .reveal').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 200);
  });
});
