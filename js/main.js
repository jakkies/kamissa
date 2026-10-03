/* Kamissa Coaching – small, dependency-free enhancements */

// Single place to set the booking link. Every element with [data-book] uses it.
const BOOKING_URL = '#book';

(() => {
  const root = document.documentElement;
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopNav = window.matchMedia('(min-width: 1280px)');

  /* ---------- Booking links ---------- */
  document.querySelectorAll('[data-book]').forEach((link) => {
    link.href = BOOKING_URL;
    if (/^https?:/.test(BOOKING_URL)) {
      link.target = '_blank';
      link.rel = 'noopener';
    }
  });

  /* ---------- Image placeholders: tint + filename when a photo is missing ---------- */
  const markMissing = (img) => {
    const holder = img.parentElement;
    holder.classList.add('is-missing');
    holder.dataset.missing = img.getAttribute('src');
  };
  document.querySelectorAll('img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) markMissing(img);
    else img.addEventListener('error', () => markMissing(img), { once: true });
  });

  /* ---------- Sticky header state ---------- */
  const updateHeader = () => header.classList.toggle('is-solid', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ---------- Mobile menu ---------- */
  const focusables = () => [toggle, ...nav.querySelectorAll('a')];

  const setMenu = (open, { returnFocus = true } = {}) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    header.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
    if (open) nav.querySelector('a').focus();
    else if (returnFocus) toggle.focus();
  };
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  toggle.addEventListener('click', () => setMenu(!isOpen()));

  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') {
      setMenu(false);
      return;
    }
    if (e.key === 'Tab') {
      // Keep focus inside the toggle + menu while open
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  nav.addEventListener('click', (e) => {
    if (e.target.closest('a') && isOpen()) setMenu(false, { returnFocus: false });
  });

  desktopNav.addEventListener('change', (e) => {
    if (e.matches && isOpen()) setMenu(false, { returnFocus: false });
  });

  /* ---------- Smooth in-page scrolling with header offset ---------- */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    const target = id && document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    const top = id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    window.scrollTo({ top, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    history.pushState(null, '', `#${id}`);

    // Move focus for keyboard and screen reader users without jumping the page
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  /* ---------- Active menu item for in-page sections (home page) ---------- */
  // Inner pages mark their own link with aria-current="page" in the HTML.
  if (!nav.querySelector('[aria-current="page"]')) {
    const spyLinks = [...nav.querySelectorAll('.site-nav__list a[href^="#"]')]
      .map((link) => ({ link, section: document.getElementById(link.getAttribute('href').slice(1)) }))
      .filter(({ section }) => section);

    const setActive = (active) => {
      spyLinks.forEach(({ link }) => {
        if (link === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };

    let ticking = false;
    const updateActive = () => {
      ticking = false;
      const line = header.offsetHeight + window.innerHeight * 0.3;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const current = atBottom
        ? spyLinks[spyLinks.length - 1]
        : spyLinks.find(({ section }) => {
          const r = section.getBoundingClientRect();
          return r.top <= line && r.bottom > line;
        });
      setActive(current ? current.link : null);
    };

    updateActive();
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActive);
      }
    }, { passive: true });
    window.addEventListener('resize', updateActive);
  }

  /* ---------- Reveal on scroll ---------- */
  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    root.classList.add('js-reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }

  /* ---------- Testimonials: controls only when there is more than one ---------- */
  document.querySelectorAll('[data-testimonials]').forEach((wrap) => {
    const slides = [...wrap.querySelectorAll('.testimonial')];
    if (slides.length < 2) return;

    let index = 0;
    const live = document.createElement('div');
    live.setAttribute('aria-live', 'polite');
    slides[0].before(live);
    slides.forEach((slide) => live.append(slide));

    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((slide, n) => { slide.hidden = n !== index; });
    };

    const controls = document.createElement('div');
    controls.className = 'testimonials__controls';
    controls.innerHTML =
      '<button type="button" aria-label="Previous testimonial">←</button>' +
      '<button type="button" aria-label="Next testimonial">→</button>';
    const [prev, next] = controls.querySelectorAll('button');
    prev.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    wrap.append(controls);
    show(0);
  });
})();
