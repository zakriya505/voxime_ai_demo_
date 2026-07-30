/* ======================================================================n   VOXIME.AI — ENHANCED INTERACTIVITY & MOTIONn   Scoped to .voxime-scope for GoHighLevel compatibilityn   ====================================================================== */
(function () {
  'use strict';

  const scope = document.body.classList.contains('voxime-scope') ? document.body : document.querySelector('.voxime-scope');
  if (!scope) return;

  /* ---------- Mobile nav ---------- */
  const menuBtn = document.querySelector('.voxime-scope .menu');
  const nav = document.querySelector('.voxime-scope nav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Sticky header ---------- */
  const header = document.querySelector('.voxime-scope .header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 12);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll('.voxime-scope [data-reveal], .voxime-scope [data-reveal-group]');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    const target = el.getAttribute('data-count');
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const num = parseFloat(target);
    if (isNaN(num)) return;
    const decimals = (target.split('.')[1] || '').length;
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = (num * eased).toFixed(decimals);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('.voxime-scope [data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const cIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cIo.observe(el); });
  }

  /* ---------- 3D card tilt ---------- */
  function addTilt(el) {
    el.addEventListener('mousemove', function (e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      el.style.transform = 'perspective(1000px) rotateX(' + (-dy * 4) + 'deg) rotateY(' + (dx * 4) + 'deg) translateZ(12px)';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transform = '';
    });
  }

  document.querySelectorAll('.voxime-scope .card, .voxime-scope .plan, .voxime-scope .product-card, .voxime-scope .team-card').forEach(addTilt);

  /* ---------- Back to top ---------- */
  const totop = document.querySelector('.voxime-scope .totop');
  if (totop) {
    window.addEventListener('scroll', function () {
      totop.classList.toggle('show', window.scrollY > 700);
    }, { passive: true });
    totop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Demo video placeholder ---------- */
  const demoVideo = document.querySelector('.voxime-scope #demo-video');
  const demoFrame = document.querySelector('.voxime-scope #demo-video-frame');
  if (demoVideo && demoFrame) {
    demoVideo.addEventListener('loadedmetadata', function () {
      demoFrame.classList.add('has-video');
    });
    const placeholder = demoFrame.querySelector('.video-placeholder');
    if (placeholder) {
      placeholder.addEventListener('click', function () {
        demoVideo.play().catch(function () {});
      });
    }
  }

  /* ---------- Contact form validation ---------- */
  const form = document.querySelector('.voxime-scope #contact-form');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      let valid = true;

      const fields = [
        { id: 'firstName', check: function (v) { return v.trim().length > 0; }, msg: 'Please enter your first name.' },
        { id: 'lastName', check: function (v) { return v.trim().length > 0; }, msg: 'Please enter your last name.' },
        { id: 'business', check: function (v) { return v.trim().length > 1; }, msg: 'Please enter your business name.' },
        { id: 'email', check: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }, msg: 'Please enter a valid work email.' },
        { id: 'phone', check: function (v) { return v.trim().length > 0 && /^[\d\s\+\-\(\)]{7,}$/.test(v.trim()); }, msg: 'Please enter a valid phone number.' }
      ];

      fields.forEach(function (field) {
        const input = form.querySelector('#' + field.id);
        if (!input) return;
        const fieldEl = input.closest('.field') || input.parentElement;
        let err = fieldEl.querySelector('.err-msg');
        if (!err) {
          err = document.createElement('p');
          err.className = 'err-msg';
          err.textContent = field.msg;
          fieldEl.appendChild(err);
        }
        const ok = field.check(input.value);
        fieldEl.classList.toggle('error', !ok);
        if (!ok) valid = false;
      });

      const consent = form.querySelector('#consent');
      if (consent && !consent.checked) {
        const fieldEl = consent.closest('.field') || consent.parentElement;
        let err = fieldEl.querySelector('.err-msg');
        if (!err) {
          err = document.createElement('p');
          err.className = 'err-msg';
          err.textContent = 'Please consent to receive messages.';
          fieldEl.appendChild(err);
        }
        fieldEl.classList.add('error');
        valid = false;
      }

      if (!valid) {
        form.querySelector('.field.error input, .field.error textarea')?.focus();
        return;
      }

      const button = form.querySelector('button[type="submit"]');
      if (button) {
        button.textContent = 'Request received';
        button.disabled = true;
      }
      const success = form.querySelector('.success');
      if (success) {
        success.classList.add('show');
        success.setAttribute('tabindex', '-1');
        success.focus();
      }
    });

    form.querySelectorAll('input, textarea, select').forEach(function (input) {
      input.addEventListener('input', function () {
        const field = input.closest('.field');
        if (field) field.classList.remove('error');
      });
    });
  }

  /* ---------- FAQ auto-close ---------- */
  document.querySelectorAll('.voxime-scope .faq').forEach(function (faq) {
    faq.addEventListener('toggle', function () {
      if (faq.open) {
        document.querySelectorAll('.voxime-scope .faq').forEach(function (other) {
          if (other !== faq && other.open) other.open = false;
        });
      }
    });
  });

  /* ---------- Canvas particle network (subtle) ---------- */
  const canvas = document.getElementById('vox-canvas');
  if (canvas && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    let animationId;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    function createParticles() {
      particles = [];
      const count = Math.min(45, Math.floor((width * height) / 35000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(56,189,248,0.35)';
      ctx.strokeStyle = 'rgba(56,189,248,0.06)';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.globalAlpha = 1 - dist / 130;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', function () {
      resize();
      createParticles();
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) cancelAnimationFrame(animationId);
      else draw();
    });
  }
})();
