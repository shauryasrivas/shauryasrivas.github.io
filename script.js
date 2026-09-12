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
  root.setAttribute('data-theme', saved || 'dark');

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

/* =========================================================
   PARALLAX + MOTION LAYER  (v3 — 12 Sep)
   Separate IIFE — does not touch the existing script above.
   ========================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var isPhone = function () { return window.matchMedia('(max-width: 700px)').matches; };

  /* ---------- 1. Scroll progress bar ---------- */
  var bar = document.querySelector('#scrollProgress i');

  /* ---------- 2. Parallax layers ---------- */
  var layers = [].slice.call(document.querySelectorAll('[data-px]'));
  var hero = document.getElementById('hero');

  var ticking = false;

  function onFrame() {
    ticking = false;
    var y = window.pageYOffset || document.documentElement.scrollTop;

    if (bar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(y / max, 1) : 0;
      bar.style.transform = 'scaleX(' + pct.toFixed(4) + ')';
    }

    if (!reduce.matches && !isPhone() && hero) {
      var h = hero.offsetHeight || 1;
      if (y < h * 1.2) {
        for (var i = 0; i < layers.length; i++) {
          var depth = parseFloat(layers[i].getAttribute('data-px')) || 0;
          layers[i].style.setProperty('--py', (y * depth).toFixed(2) + 'px');
        }
      }
    }
  }

  function requestFrame() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onFrame); }
  }

  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestFrame, { passive: true });
  onFrame();

  /* ---------- 3. Mouse tilt on the portrait ---------- */
  var photoWrap = document.querySelector('.hero-photo');
  var frame = document.querySelector('.photo-frame');

  if (photoWrap && frame && !reduce.matches && window.matchMedia('(hover: hover)').matches) {
    var tiltRaf = null;

    photoWrap.addEventListener('mousemove', function (e) {
      if (tiltRaf) return;
      tiltRaf = window.requestAnimationFrame(function () {
        tiltRaf = null;
        var r = frame.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        frame.classList.add('tilting');
        frame.style.setProperty('--ty', (px * 9).toFixed(2) + 'deg');
        frame.style.setProperty('--tx', (-py * 9).toFixed(2) + 'deg');
      });
    }, { passive: true });

    photoWrap.addEventListener('mouseleave', function () {
      frame.classList.remove('tilting');
      frame.style.setProperty('--ty', '0deg');
      frame.style.setProperty('--tx', '0deg');
    });
  }

  /* ---------- 4. Hero stats count-up ---------- */
  var stats = [].slice.call(document.querySelectorAll('.hero-stats dd'));

  function countUp(el) {
    var target = parseInt(el.textContent.trim(), 10);
    if (isNaN(target)) return;
    if (reduce.matches) { el.textContent = target; return; }

    var dur = 900;
    var start = null;
    el.textContent = '0';

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) window.requestAnimationFrame(step);
      else el.textContent = target;
    }
    window.requestAnimationFrame(step);
  }

  if (stats.length) {
    if (!('IntersectionObserver' in window) || reduce.matches) {
      // leave the numbers as authored
    } else {
      var statObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { countUp(en.target); obs.unobserve(en.target); }
        });
      }, { threshold: 0.6 });
      stats.forEach(function (s) { statObs.observe(s); });
    }
  }

  /* ---------- 5. Staggered reveal for grouped blocks ---------- */
  var groups = [].slice.call(document.querySelectorAll('.reveal-stagger'));

  if (groups.length) {
    if (!('IntersectionObserver' in window) || reduce.matches) {
      groups.forEach(function (g) { g.classList.add('in'); });
    } else {
      var groupObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
      groups.forEach(function (g) { groupObs.observe(g); });
    }
  }
})();

/* =========================================================
   MODERN LAYER - kinetic headline, card spotlight, magnetic buttons
   ========================================================= */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- 1. Split the headline into animated letters ---------- */
  var h1 = document.querySelector('h1.kinetic');
  if (h1 && !reduce.matches) {
    var text = h1.textContent.trim();
    var frag = document.createDocumentFragment();
    var i = 0;

    text.split(' ').forEach(function (word, wi) {
      if (wi > 0) frag.appendChild(document.createTextNode(' '));
      var wrap = document.createElement('span');
      wrap.className = 'kword';
      word.split('').forEach(function (ch) {
        var l = document.createElement('span');
        l.className = 'kl';
        l.style.setProperty('--i', i++);
        l.textContent = ch;
        wrap.appendChild(l);
      });
      frag.appendChild(wrap);
    });

    h1.textContent = '';
    h1.appendChild(frag);
    h1.setAttribute('aria-label', text);
  }

  /* ---------- 2. Cursor spotlight on cards ---------- */
  var cards = [].slice.call(document.querySelectorAll('.card'));
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  if (cards.length && finePointer.matches && !reduce.matches) {
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
      card.addEventListener('mouseleave', function () {
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
      });
    });
  }

  /* ---------- 3. Magnetic hero buttons ---------- */
  var mags = [].slice.call(document.querySelectorAll('.hero-btns .btn'));

  if (mags.length && finePointer.matches && !reduce.matches) {
    mags.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        btn.style.transform = 'translate(' + (dx * 5).toFixed(2) + 'px,' + (dy * 4).toFixed(2) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }
})();

/* =========================================================
   BOLD LAYER - intro curtain, custom cursor, ghost numerals,
   headline sheen, card tilt
   ========================================================= */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  var root = document.documentElement;

  /* ---------- 1. Intro curtain ---------- */
  var pre = document.getElementById('preloader');
  var count = document.getElementById('preCount');
  var bar = document.getElementById('preBar');

  function finishIntro() {
    root.classList.remove('locked');
    root.classList.add('is-ready');
    if (pre) {
      pre.classList.add('done');
      window.setTimeout(function () { if (pre.parentNode) pre.parentNode.removeChild(pre); }, 1100);
    }
  }

  if (!pre || reduce.matches) {
    if (pre) pre.parentNode.removeChild(pre);
    root.classList.add('is-ready');
  } else {
    root.classList.add('locked');
    var pct = 0;
    var tick = window.setInterval(function () {
      pct = Math.min(pct + Math.random() * 11 + 4, 100);
      var shown = Math.floor(pct);
      if (count) count.textContent = shown < 10 ? '0' + shown : String(shown);
      if (bar) bar.style.width = pct + '%';
      if (pct >= 100) {
        window.clearInterval(tick);
        window.setTimeout(finishIntro, 260);
      }
    }, 90);
    window.setTimeout(function () { window.clearInterval(tick); finishIntro(); }, 4000);
  }

  /* ---------- 2. Custom cursor ---------- */
  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');

  if (dot && ring && fine.matches && !reduce.matches) {
    root.classList.add('cursor-on');
    var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    var rx = tx, ry = ty;

    document.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = 'translate(' + (tx - 3.5) + 'px,' + (ty - 3.5) + 'px)';
    });

    (function loop() {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      ring.style.transform = 'translate(' + (rx - 19) + 'px,' + (ry - 19) + 'px)';
      window.requestAnimationFrame(loop);
    })();

    var hot = 'a, button, .card, input, textarea, .cert-view';
    document.querySelectorAll(hot).forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-hot'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-hot'); });
    });
  } else if (dot && ring) {
    dot.parentNode.removeChild(dot);
    ring.parentNode.removeChild(ring);
  }

  /* ---------- 3. Ghost section numerals ---------- */
  var sections = [].slice.call(document.querySelectorAll('.section'));
  var ghosts = [];

  sections.forEach(function (sec) {
    var kicker = sec.querySelector('.kicker');
    if (!kicker) return;
    var m = kicker.textContent.match(/\d+/);
    if (!m) return;
    var g = document.createElement('span');
    g.className = 'ghost-num';
    g.setAttribute('aria-hidden', 'true');
    g.textContent = m[0];
    sec.insertBefore(g, sec.firstChild);
    ghosts.push({ el: g, sec: sec });
  });

  /* ---------- 4. Headline sheen + ghost parallax on scroll ---------- */
  var hero = document.querySelector('.hero h1.mega');

  if (hero && fine.matches && !reduce.matches) {
    document.addEventListener('mousemove', function (e) {
      hero.style.setProperty('--sx', e.clientX + 'px');
      hero.style.setProperty('--sy', e.clientY + 'px');
    });
  }

  if (ghosts.length && !reduce.matches) {
    var ticking = false;
    function paintGhosts() {
      var vh = window.innerHeight;
      ghosts.forEach(function (g) {
        var r = g.sec.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var progress = (vh - r.top) / (vh + r.height);
        g.el.style.transform = 'translate3d(0,' + (progress * 150 - 40).toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(paintGhosts); }
    }, { passive: true });
    paintGhosts();
  }

  /* ---------- 5. Subtle 3D tilt on cards ---------- */
  if (fine.matches && !reduce.matches) {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        card.style.transform = 'perspective(900px) rotateY(' + (dx * 3).toFixed(2) + 'deg) rotateX(' + (-dy * 3).toFixed(2) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }
})();
