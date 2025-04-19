document.addEventListener('DOMContentLoaded', () => {
  // 1) Получаем canvas и wrapper
  const canvas  = document.getElementById('snake-bg');
  const wrapper = document.querySelector('.wrapper');
  if (!canvas || !wrapper) return;

  wrapper.style.position = 'relative';
  Object.assign(canvas.style, {
    position:      'absolute',
    top:           '0',
    left:          '0',
    pointerEvents: 'none',
    zIndex:        '-1'
  });
  const ctx = canvas.getContext('2d');

  // 2) Подгоняем размеры
  function resize() {
    const rect = wrapper.getBoundingClientRect();
    canvas.width  = rect.width;
    canvas.height = rect.height;
  }
  window.addEventListener('resize', resize);
  resize();

  // 3) Генерируем 100 точек‑пикселей 4×4
  const POINT_SIZE = 4;
  let points = [];
  function genPoints() {
    points = [];
    for (let i = 0; i < 100; i++) {
      points.push({
        x: Math.random() * (canvas.width  - POINT_SIZE),
        y: Math.random() * (canvas.height - POINT_SIZE)
      });
    }
  }
  genPoints();

  // 4) Класс «змейка»
  class Snake {
    constructor() {
      this.thickness = 4;    
      this.lengthPx  = 16;   
      this.maxLength = this.lengthPx / this.thickness;
      this.speed     = 1;    

      // стартовая позиция под логотипом
      const logo = document.querySelector('.header__logo');
      const r    = logo?.getBoundingClientRect();
      const w    = wrapper.getBoundingClientRect();
      const startX = r
        ? r.left - w.left + (r.width - this.thickness) / 2
        : Math.random()*(canvas.width  - this.thickness);
      const startY = r
        ? r.bottom - w.top + 10
        : Math.random()*(canvas.height - this.thickness);

      this.segments = [];
      for (let i = 0; i < this.maxLength; i++) {
        this.segments.push({
          x: startX,
          y: startY + i * this.thickness
        });
      }
    }

    step() {
      const head = this.segments[0];
      const cx   = head.x + this.thickness/2;
      const cy   = head.y + this.thickness/2;

      // найти ближайшую точку
      let nearest = null, best = Infinity;
      for (const p of points) {
        const dx0 = (p.x + POINT_SIZE/2) - cx;
        const dy0 = (p.y + POINT_SIZE/2) - cy;
        const d2  = dx0*dx0 + dy0*dy0;
        if (d2 < best) { best = d2; nearest = p; }
      }

      // вектор к цели
      let dx = 0, dy = 0;
      if (nearest) {
        dx = nearest.x - head.x;
        dy = nearest.y - head.y;
      }

      if (Math.abs(dx) > Math.abs(dy)) {
        dx = Math.sign(dx);
        dy = 0;
      } else {
        dx = 0;
        dy = Math.sign(dy);
      }

      head.x = (head.x + dx*this.speed + canvas.width ) % canvas.width;
      head.y = (head.y + dy*this.speed + canvas.height) % canvas.height;

      this.segments.unshift({ x: head.x, y: head.y });
      if (this.segments.length > this.maxLength) {
        this.segments.pop();
      }

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (
          p.x < head.x + this.thickness &&
          p.x + POINT_SIZE > head.x &&
          p.y < head.y + this.thickness &&
          p.y + POINT_SIZE > head.y
        ) {
          points.splice(i, 1);
          this.maxLength++;
          break;
        }
      }

      if (points.length === 0) genPoints();
    }

    draw() {
      ctx.fillStyle = 'rgba(62, 7, 137, 0.8)';
      for (const seg of this.segments) {
        ctx.fillRect(seg.x, seg.y, this.thickness, this.thickness);
      }
    }
  }

  const snake = new Snake();

  // 5) Цикл анимации
  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(62, 7, 137, 0.5)';
    for (const p of points) {
      ctx.fillRect(p.x, p.y, POINT_SIZE, POINT_SIZE);
    }

    snake.step();
    snake.draw();

    requestAnimationFrame(loop);
  })();
});
