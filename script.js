(() => {
  const canvas = document.getElementById('bg');
  if (!canvas) return console.warn('Canvas #bg não encontrado.');
  const ctx = canvas.getContext('2d');
  if (!ctx) return console.warn('Contexto 2D não disponível.');

  let W = (canvas.width = window.innerWidth);
  let H = (canvas.height = window.innerHeight);

  const MAX_PARTICLES = 700;
  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const rand = (a, b) => Math.random() * (b - a) + a;
  const colorsSets = [
    ['#FFDE7D', '#FF8A7A', '#7DE1FF', '#9D7DFF'],
    ['#7FFFD4', '#61C0BF', '#FFD27D', '#FF7FBF'],
    ['#C3B1FF', '#8EE7FF', '#FFDDAA', '#FFB3B3'],
  ];
  let colors = colorsSets[0];

  class Particle {
    constructor(x, y, dx, dy, r, color, ttl) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.r = r;
      this.color = color;
      this.life = 0;
      this.ttl = ttl || Math.floor(rand(180, 420));
    }
    update() {
      this.x += this.dx;
      this.y += this.dy;
      this.life++;
      if (this.x < -100) this.x = W + 100;
      if (this.x > W + 100) this.x = -100;
      if (this.y < -100) this.y = H + 100;
      if (this.y > H + 100) this.y = -100;
      return this.life < this.ttl;
    }
    draw(ctx) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        Math.max(1, this.r * 3)
      );
      g.addColorStop(0, this.color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let particles = [];

  function spawnBurst(x, y, amount = 25) {
    for (let i = 0; i < amount; i++) {
      const a = rand(0, Math.PI * 2);
      const s = rand(0.5, 3.5);
      const p = new Particle(
        x + rand(-5, 5),
        y + rand(-5, 5),
        Math.cos(a) * s,
        Math.sin(a) * s,
        rand(5, 15),
        colors[Math.floor(Math.random() * colors.length)],
        Math.floor(rand(60, 180))
      );
      particles.push(p);
    }
    enforceLimit();
  }

  function enforceLimit() {
    if (particles.length > MAX_PARTICLES)
      particles.splice(0, particles.length - MAX_PARTICLES);
  }

  // mousemove gera partículas leves
  window.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.15) {
      particles.push(
        new Particle(
          e.clientX + rand(-10, 10),
          e.clientY + rand(-10, 10),
          rand(-0.4, 0.4),
          rand(-0.4, 0.4),
          rand(6, 20),
          colors[Math.floor(Math.random() * colors.length)]
        )
      );
      enforceLimit();
    }
  });

  // clique gera estouro de partículas — corrigido
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spawnBurst(x, y, 32);
  });

  // tecla 'C' muda paleta
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'c') {
      colors = colorsSets[Math.floor(Math.random() * colorsSets.length)];
      spawnBurst(W / 2, H / 2, 16);
    }
  });

  function frame() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(8,12,20,0.35)';
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.update()) p.draw(ctx);
      else {
        particles[i] = particles[particles.length - 1];
        particles.pop();
        i--;
      }
    }

    requestAnimationFrame(frame);
  }
  frame();

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const subscribeBtn = document.getElementById('subscribe');
  const emailInput = document.getElementById('email');
  if (subscribeBtn && emailInput) {
    subscribeBtn.addEventListener('click', () => {
      const email = emailInput.value.trim();
      const basicEmailRegex = /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/;
      if (!email || !basicEmailRegex.test(email)) {
        alert('Digite um e-mail válido :)');
        return;
      }
      emailInput.value = '';
      alert('Obrigado! Avisaremos quando o site estiver pronto — ' + email);
    });
  }
})();