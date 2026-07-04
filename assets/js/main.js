/* The Gallery & The Bonfire.
   Hero: pointillism name — water physics in the gallery, ignition in the dark.
   Atmosphere: page-wide petals/leaves falling (light) or embers rising (dark),
   plus universal click effects — pond ripples or spreading fire. */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAU = Math.PI * 2;

  /* ———— theme ———— */

  const PALETTES = {
    light: ['#6D9BC3', '#4E7FA6', '#8FAE7E', '#6FA294', '#52708C'],
    dark: ['#C9A227', '#D4762C', '#E4C063', '#8B6914', '#A34A1F'],
  };
  const SPARK_COLORS = ['#E4C063', '#D4762C', '#C9A227'];
  const THEME_COLOR = { light: '#F2F5F3', dark: '#14110D' };
  const EMBER_COLOR = '#D4762C';

  let mode = root.dataset.mode === 'dark' ? 'dark' : 'light';

  const toggle = document.getElementById('theme-toggle');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const copyNodes = Array.from(document.querySelectorAll('[data-light]'));

  function swapCopy(next, instant) {
    const write = () => copyNodes.forEach((el) => { el.textContent = el.dataset[next]; });
    if (instant || reduceMotion) { write(); return; }
    copyNodes.forEach((el) => el.classList.add('fading'));
    setTimeout(() => {
      write();
      copyNodes.forEach((el) => el.classList.remove('fading'));
    }, 300);
  }

  function applyMode(next, instant) {
    mode = next;
    root.dataset.mode = next;
    try { localStorage.setItem('mode', next); } catch (e) { /* private browsing */ }
    if (metaTheme) metaTheme.content = THEME_COLOR[next];
    toggle.setAttribute('aria-pressed', String(next === 'dark'));
    swapCopy(next, instant);
    recolorParticles();
    populateAmbient();
  }

  function igniteButton() {
    toggle.classList.add('igniting');
    setTimeout(() => toggle.classList.remove('igniting'), 700);
  }

  function heroCenterOnPage() {
    const rect = canvas.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  function switchTheme() {
    const next = mode === 'light' ? 'dark' : 'light';
    if (!reduceMotion && typeof document.startViewTransition === 'function') {
      const r = toggle.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      root.classList.add('theme-instant');
      const vt = document.startViewTransition(() => applyMode(next, true));
      vt.ready.then(() => {
        const maxR = Math.hypot(
          Math.max(cx, window.innerWidth - cx),
          Math.max(cy, window.innerHeight - cy)
        );
        root.animate(
          { clipPath: ['circle(0px at ' + cx + 'px ' + cy + 'px)', 'circle(' + maxR + 'px at ' + cx + 'px ' + cy + 'px)'] },
          { duration: 700, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(() => {});
      const skipTimer = setTimeout(() => {
        try { vt.skipTransition(); } catch (err) { /* already done */ }
      }, 1400);
      vt.finished.catch(() => {}).finally(() => {
        clearTimeout(skipTimer);
        root.classList.remove('theme-instant');
        const c = heroCenterOnPage();
        if (mode === 'dark') {
          fireAt(c.x, c.y);
          if (heroVisible) igniteAt(W / 2, H / 2);
        } else {
          splashAt(c.x, c.y);
          if (heroVisible) rippleAt(W / 2, H / 2);
        }
      });
    } else {
      applyMode(next, reduceMotion);
      if (reduceMotion) drawStatic();
      else scatter();
    }
    igniteButton();
  }

  toggle.addEventListener('click', switchTheme);

  /* ———— pointillism hero ———— */

  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');

  let W = 0;
  let H = 0;
  let targets = [];
  let particles = [];
  let ripples = [];
  let ignitions = [];
  let dabs = [];
  let heroBottom = 1;
  let dissolve = 0;
  let heroVisible = true;
  let needsClear = false;

  const pointer = { x: -1e4, y: -1e4, active: false };

  function buildTargets() {
    const off = document.createElement('canvas');
    off.width = W;
    off.height = H;
    const o = off.getContext('2d');
    const size = Math.min(W / 6.2, H * 0.52, 170);
    o.fillStyle = '#000';
    o.font = '700 ' + size + 'px Georgia, "Times New Roman", serif';
    o.textAlign = 'center';
    o.textBaseline = 'middle';
    o.fillText('Zirui Wang', W / 2, H / 2);
    const data = o.getImageData(0, 0, W, H).data;
    targets = [];
    const step = W > 900 ? 4 : 3;
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        if (data[(y * W + x) * 4 + 3] > 128 && Math.random() < 0.85) targets.push([x, y]);
      }
    }
  }

  function makeParticles() {
    const pal = PALETTES[mode];
    particles = targets.map(([tx, ty]) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      tx,
      ty,
      dx: (Math.random() - 0.5) * 150,
      dy: -20 - Math.random() * 90,
      c: pal[(Math.random() * pal.length) | 0],
      r: 1.1 + Math.random() * 1.5,
      ph: Math.random() * TAU,
      heat: 0,
    }));
    if (reduceMotion) particles.forEach((p) => { p.x = p.tx; p.y = p.ty; });
  }

  function recolorParticles() {
    const pal = PALETTES[mode];
    particles.forEach((p) => { p.c = pal[(Math.random() * pal.length) | 0]; });
  }

  function scatter() {
    particles.forEach((p) => { p.x = Math.random() * W; p.y = Math.random() * H; });
  }

  /* water: an unseen ring that displaces the dots (rings drawn by the fx layer) */
  function rippleAt(x, y) {
    ripples.push({ x, y, r: 4, v: 5.5, alpha: 0.5 });
    if (ripples.length > 6) ripples.shift();
  }

  /* fire: an ignition front that sets dots alight instead of pushing them */
  function igniteAt(x, y) {
    ignitions.push({ x, y, r: 4, v: 6.5 });
    if (ignitions.length > 6) ignitions.shift();
  }

  function addDabs(x0, y0, x1, y1) {
    const d = Math.hypot(x1 - x0, y1 - y0);
    if (d < 6) return;
    const n = Math.min(3, Math.round(d / 14) + 1);
    const pal = PALETTES[mode];
    for (let i = 0; i < n; i++) {
      const t = Math.random();
      dabs.push({
        x: x0 + (x1 - x0) * t + (Math.random() - 0.5) * 6,
        y: y0 + (y1 - y0) * t + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: mode === 'dark' ? -(0.3 + Math.random() * 0.7) : (Math.random() - 0.5) * 0.3,
        r: 1.4 + Math.random() * 2.2,
        life: 1,
        decay: 0.012 + Math.random() * 0.015,
        c: pal[(Math.random() * pal.length) | 0],
      });
    }
    if (dabs.length > 160) dabs.splice(0, dabs.length - 160);
  }

  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (!reduceMotion && pointer.active) addDabs(pointer.x, pointer.y, x, y);
    pointer.x = x;
    pointer.y = y;
    pointer.active = true;
  });

  canvas.addEventListener('pointerleave', () => {
    pointer.active = false;
    pointer.x = -1e4;
    pointer.y = -1e4;
  });

  function drawStatic() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 0.92;
    for (const p of particles) {
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.tx, p.ty, p.r, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function tick(ts) {
    if (!heroVisible) {
      if (needsClear) { ctx.clearRect(0, 0, W, H); needsClear = false; }
      requestAnimationFrame(tick);
      return;
    }
    needsClear = true;

    ctx.clearRect(0, 0, W, H);
    const fade = 1 - dissolve;
    const k = dissolve * dissolve;

    for (const p of particles) {
      p.x += (p.tx + p.dx * k - p.x) * 0.06;
      p.y += (p.ty + p.dy * k - p.y) * 0.06;

      if (pointer.active) {
        const rx = p.x - pointer.x;
        const ry = p.y - pointer.y;
        const d2 = rx * rx + ry * ry;
        if (d2 < 8100 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / 90) * 3.2;
          p.x += (rx / d) * f;
          p.y += (ry / d) * f;
        }
      }

      for (const rp of ripples) {
        const rx = p.x - rp.x;
        const ry = p.y - rp.y;
        const d = Math.hypot(rx, ry);
        const band = Math.abs(d - rp.r);
        if (band < 34 && d > 0.01) {
          const f = (1 - band / 34) * rp.alpha * 14;
          p.x += (rx / d) * f;
          p.y += (ry / d) * f;
        }
      }

      for (const ig of ignitions) {
        const d = Math.hypot(p.x - ig.x, p.y - ig.y);
        if (Math.abs(d - ig.r) < 26) p.heat = 1;
      }
      if (p.heat > 0) p.heat = Math.max(0, p.heat - 0.022);

      let ox;
      let oy;
      if (mode === 'light') {
        ox = Math.sin(ts / 1000 + p.tx * 0.02) * 1.1;
        oy = Math.cos(ts / 1400 + p.ph) * 0.5;
      } else {
        const j = Math.sin(ts / 500 + p.ph * 3) * 0.5;
        ox = j * 0.4;
        oy = j;
      }

      let fill = p.c;
      let rr = p.r;
      if (p.heat > 0) {
        fill = p.heat > 0.66 ? '#F6E7B2' : p.heat > 0.33 ? '#E4C063' : p.c;
        rr = p.r * (1 + p.heat * 0.9);
      }
      ctx.globalAlpha = 0.92 * fade;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(p.x + ox, p.y + oy, rr, 0, TAU);
      ctx.fill();
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += rp.v;
      rp.v *= 0.985;
      rp.alpha *= 0.965;
      if (rp.alpha < 0.02) ripples.splice(i, 1);
    }

    const maxDim = Math.max(W, H);
    for (let i = ignitions.length - 1; i >= 0; i--) {
      const ig = ignitions[i];
      ig.r += ig.v;
      if (ig.r > maxDim) ignitions.splice(i, 1);
    }

    for (let i = dabs.length - 1; i >= 0; i--) {
      const d = dabs[i];
      d.x += d.vx;
      d.y += d.vy;
      d.life -= d.decay;
      if (d.life <= 0) { dabs.splice(i, 1); continue; }
      ctx.globalAlpha = d.life * 0.7 * fade;
      ctx.fillStyle = d.c;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * d.life, 0, TAU);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  /* ———— atmosphere layer: drifting ambience + universal click effects ———— */

  const fx = document.getElementById('fx-canvas');
  const fctx = fx.getContext('2d');

  let FW = 0;
  let FH = 0;
  let ambient = [];
  let fxRings = [];
  let fireFronts = [];
  let fxSparks = [];

  function makeEmberDrifter() {
    return {
      x: Math.random() * FW,
      y: Math.random() * FH,
      vy: -(0.25 + Math.random() * 0.5),
      wind: (Math.random() - 0.5) * 0.15,
      freq: 0.4 + Math.random() * 0.8,
      ph: Math.random() * TAU,
      s: 0.8 + Math.random() * 1.4,
      a: 0.15 + Math.random() * 0.4,
      ix: 0,
      iy: 0,
    };
  }

  /* ambience is the bonfire's alone: embers rise in the dark, the gallery stays still */
  function populateAmbient() {
    ambient = [];
    if (reduceMotion || !FW || mode !== 'dark') return;
    const area = FW * FH;
    const n = Math.round(Math.min(40, Math.max(14, area / 45000)));
    for (let i = 0; i < n; i++) ambient.push(makeEmberDrifter());
  }

  function splashAt(x, y) {
    fxRings.push({ x, y, r: 4, v: 5, alpha: 0.45 });
    fxRings.push({ x, y, r: 1, v: 4.2, alpha: 0.28 });
    if (fxRings.length > 10) fxRings.splice(0, fxRings.length - 10);
  }

  function fireAt(x, y) {
    fireFronts.push({ x, y, r: 6, v: 4.6, alpha: 0.9, seed: Math.random() * 100 });
    if (fireFronts.length > 5) fireFronts.shift();
    for (let i = 0; i < 24; i++) {
      const a = Math.random() * TAU;
      const sp = 1 + Math.random() * 3.2;
      fxSparks.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 1.2,
        r: 0.8 + Math.random() * 1.6,
        life: 1,
        decay: 0.014 + Math.random() * 0.02,
        c: SPARK_COLORS[(Math.random() * SPARK_COLORS.length) | 0],
      });
    }
    if (fxSparks.length > 180) fxSparks.splice(0, fxSparks.length - 180);
  }

  function fxTick(ts) {
    fctx.clearRect(0, 0, FW, FH);

    for (const d of ambient) {
      d.x += d.wind + Math.sin((ts / 1000) * d.freq + d.ph) * 0.4 + d.ix;
      d.y += d.vy + d.iy;
      d.ix *= 0.92;
      d.iy *= 0.92;
      if (d.y < -14) { d.y = FH + 12; d.x = Math.random() * FW; }
      if (d.x < -20) d.x = FW + 16;
      if (d.x > FW + 20) d.x = -16;
      fctx.globalAlpha = d.a * (0.7 + 0.3 * Math.sin(ts / 200 + d.ph));
      fctx.fillStyle = EMBER_COLOR;
      fctx.beginPath();
      fctx.arc(d.x, d.y, d.s, 0, TAU);
      fctx.fill();
    }

    for (let i = fxRings.length - 1; i >= 0; i--) {
      const rp = fxRings[i];
      rp.r += rp.v;
      rp.v *= 0.985;
      rp.alpha *= 0.96;
      if (rp.alpha < 0.02) { fxRings.splice(i, 1); continue; }
      fctx.globalAlpha = rp.alpha;
      fctx.strokeStyle = '#4E7FA6';
      fctx.lineWidth = 1.4;
      fctx.beginPath();
      fctx.arc(rp.x, rp.y, rp.r, 0, TAU);
      fctx.stroke();
    }

    for (let i = fireFronts.length - 1; i >= 0; i--) {
      const f = fireFronts[i];
      f.r += f.v;
      f.v *= 0.99;
      f.alpha *= 0.95;
      if (f.alpha < 0.03) { fireFronts.splice(i, 1); continue; }
      const n = 42;
      for (let j = 0; j < n; j++) {
        const a = (j / n) * TAU;
        const jr = f.r + Math.sin(a * 7 + ts / 55 + f.seed) * 5 + Math.sin(a * 13 + f.seed * 3) * 3;
        fctx.globalAlpha = f.alpha * (0.45 + 0.55 * Math.abs(Math.sin(a * 9 + ts / 70 + f.seed)));
        fctx.fillStyle = j % 3 === 0 ? '#E4C063' : EMBER_COLOR;
        fctx.beginPath();
        fctx.arc(f.x + Math.cos(a) * jr, f.y + Math.sin(a) * jr, 1.2 + Math.random() * 1.6, 0, TAU);
        fctx.fill();
      }
    }

    for (let i = fxSparks.length - 1; i >= 0; i--) {
      const s = fxSparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 0.98;
      s.vy = s.vy * 0.98 - 0.02;
      s.life -= s.decay;
      if (s.life <= 0) { fxSparks.splice(i, 1); continue; }
      fctx.globalAlpha = s.life;
      fctx.fillStyle = s.c;
      fctx.beginPath();
      fctx.arc(s.x, s.y, s.r * (0.4 + s.life * 0.6), 0, TAU);
      fctx.fill();
    }

    fctx.globalAlpha = 1;
    requestAnimationFrame(fxTick);
  }

  document.addEventListener('click', (e) => {
    if (reduceMotion || e.detail === 0) return;
    if (e.target.closest && e.target.closest('#theme-toggle')) return;
    const x = e.clientX;
    const y = e.clientY;

    if (mode === 'dark') fireAt(x, y);
    else splashAt(x, y);

    for (const d of ambient) {
      const dx = d.x - x;
      const dy = d.y - y;
      const dist = Math.hypot(dx, dy);
      if (dist < 140 && dist > 1) {
        const f = (1 - dist / 140) * 5;
        d.ix += (dx / dist) * f;
        d.iy += (dy / dist) * f;
      }
    }

    const rect = canvas.getBoundingClientRect();
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      const hx = x - rect.left;
      const hy = y - rect.top;
      if (mode === 'dark') igniteAt(hx, hy);
      else rippleAt(hx, hy);
    }
  });

  document.addEventListener('pointermove', (e) => {
    if (reduceMotion) return;
    for (const d of ambient) {
      const dx = d.x - e.clientX;
      const dy = d.y - e.clientY;
      const d2 = dx * dx + dy * dy;
      if (d2 < 4900 && d2 > 1) {
        const dist = Math.sqrt(d2);
        const f = (1 - dist / 70) * 0.6;
        d.ix += (dx / dist) * f;
        d.iy += (dy / dist) * f;
      }
    }
  });

  /* ———— layout & scroll ———— */

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.round(canvas.clientWidth);
    H = Math.round(canvas.clientHeight);
    if (W && H) {
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      heroBottom = canvas.getBoundingClientRect().bottom + window.scrollY;
      buildTargets();
      makeParticles();
      if (reduceMotion) drawStatic();
    }
    FW = window.innerWidth;
    FH = window.innerHeight;
    fx.width = FW * dpr;
    fx.height = FH * dpr;
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    populateAmbient();
  }

  function onScroll() {
    const y = window.scrollY;
    dissolve = Math.max(0, Math.min(1, y / (heroBottom * 0.72)));
    heroVisible = y < heroBottom + 80;
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ———— scroll reveal ———— */

  const revealNodes = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealNodes.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealNodes.forEach((el) => io.observe(el));
  }

  const cue = document.getElementById('scroll-cue');
  if (cue) {
    cue.addEventListener('click', () => {
      document.getElementById('currently')
        .scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ———— boot ———— */

  resize();
  onScroll();
  if (mode === 'dark') {
    swapCopy('dark', true);
    toggle.setAttribute('aria-pressed', 'true');
  }
  if (!reduceMotion) {
    requestAnimationFrame(tick);
    requestAnimationFrame(fxTick);
  }
})();
