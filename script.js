/* =========================================================
   Shaurya — Portfolio
   Vanilla JS. No dependencies, no build step.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (remembers your choice) ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');

  function systemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  root.setAttribute('data-theme', saved || systemTheme());

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---------- Nav: shadow on scroll ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Nav: mobile menu ---------- */
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');

  function closeMenu() {
    if (!navLinks || !burger) return;
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }

  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });
  }

  /* ---------- Nav: highlight the section you're viewing ---------- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main section[id]')
  );
  var linkMap = {};
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    linkMap[a.getAttribute('href').slice(1)] = a;
  });

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkMap[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.keys(linkMap).forEach(function (k) { linkMap[k].classList.remove('active'); });
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-72px 0px -65% 0px', threshold: 0 });

    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Reveal elements on scroll ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealItems = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    revealItems.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Certificate lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbBody = document.getElementById('lbBody');
  var lbTitle = document.getElementById('lbTitle');
  var lbClose = document.getElementById('lbClose');
  var lastFocused = null;

  function openLightbox(src, title) {
    if (!lightbox) return;
    lastFocused = document.activeElement;
    lbTitle.textContent = title || 'Certificate';
    lbBody.innerHTML = '';

    var img = new Image();
    img.alt = title || 'Certificate';
    img.onload = function () { lbBody.innerHTML = ''; lbBody.appendChild(img); };
    img.onerror = function () {
      lbBody.innerHTML =
        '<div class="lb-missing">' +
        '<strong>No image found</strong>' +
        '<span>Save your certificate as <code>' + src + '</code> next to index.html.</span>' +
        '</div>';
    };
    img.src = src;

    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    lbBody.innerHTML = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  /* Show the real certificate as the card thumbnail when the image exists */
  document.querySelectorAll('.cert-view').forEach(function (btn) {
    var src = btn.dataset.cert;
    if (!src) return;
    var probe = new Image();
    probe.onload = function () {
      var slot = btn.querySelector('.cert-thumb');
      if (!slot) return;
      var img = new Image();
      img.src = src;
      img.alt = '';
      slot.replaceWith(img);
    };
    probe.src = src;
  });

  document.querySelectorAll('.cert-view, .cert-open').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openLightbox(btn.dataset.cert, btn.dataset.title);
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (lightbox && !lightbox.hidden) closeLightbox();
      closeMenu();
    }
  });
})();
