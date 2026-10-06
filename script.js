/* ══════════════════════════════
   PARTICLES
══════════════════════════════ */
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const COUNT = 40;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.5 + 0.4,
      dx:    (Math.random() - 0.5) * 0.3,
      dy:    -(Math.random() * 0.4 + 0.1),
      alpha: Math.random() * 0.5 + 0.1,
    };
  }

  function init() {
    resize();
    for (let i = 0; i < COUNT; i++) particles.push(createParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(201,169,110,' + p.alpha + ')';
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.y < -10) { Object.assign(p, createParticle(), { y: canvas.height + 10 }); }
      if (p.x < 0)            p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();

/* ══════════════════════════════
   PHOTO SLIDER
══════════════════════════════ */
(function () {
  const track     = document.getElementById('sliderTrack');
  const slides    = Array.from(track.querySelectorAll('.slide'));
  const dots      = Array.from(document.querySelectorAll('#sliderDots .dot'));
  const prevBtn   = document.getElementById('prevBtn');
  const nextBtn   = document.getElementById('nextBtn');
  let current     = 0;
  let autoTimer   = null;
  let startX      = 0;
  let isDragging  = false;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 4000);
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
  dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.index); startAuto(); }));

  /* Touch swipe */
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    if (!isDragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
      startAuto();
    }
    isDragging = false;
  });

  startAuto();
})();

/* ══════════════════════════════
   COUNTDOWN
══════════════════════════════ */
(function () {
  // 행사일: 2032년 10월 1일 오후 5시 (KST = UTC+9)
  const target   = new Date('2032-10-01T17:00:00+09:00').getTime();
  const elDays   = document.getElementById('cd-days');
  const elHours  = document.getElementById('cd-hours');
  const elMins   = document.getElementById('cd-mins');
  const elSecs   = document.getElementById('cd-secs');
  const grid     = document.getElementById('countdownGrid');
  const finished = document.getElementById('countdownFinished');

  function pad(n) { return String(n).padStart(2, '0'); }

  function flash(el, newVal) {
    if (el.textContent !== newVal) {
      el.classList.add('flip');
      setTimeout(() => {
        el.textContent = newVal;
        el.classList.remove('flip');
      }, 150);
    }
  }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      grid.style.display     = 'none';
      finished.style.display = 'block';
      return;
    }
    flash(elDays,  pad(Math.floor(diff / 86400000)));
    flash(elHours, pad(Math.floor((diff % 86400000) / 3600000)));
    flash(elMins,  pad(Math.floor((diff % 3600000)  / 60000)));
    flash(elSecs,  pad(Math.floor((diff % 60000)    / 1000)));
  }

  tick();
  setInterval(tick, 1000);
})();

/* ══════════════════════════════
   SCROLL REVEAL
══════════════════════════════ */
(function () {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));
})();
