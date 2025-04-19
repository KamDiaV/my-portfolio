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

  // 2) Подгоняем размеры под wrapper
  function resize() {
    const rect = wrapper.getBoundingClientRect();
    canvas.width  = rect.width;
    canvas.height = rect.height;
  }
  window.addEventListener('resize', resize);
  resize();

  // 3) Генерация 100 точек‑пикселей серого цвета 4×4
  const POINT_SIZE = 4;
  let points = [];
  function genPoints() {
    points = [];
    for (let i = 0; i < 100; i++) {
      points.push({
        x: Math.random() * (canvas.width - POINT_SIZE),
        y: Math.random() * (canvas.height - POINT_SIZE),
      });
    }
  }
  genPoints();

  // 4) Класс змейки
  class Snake {
    /**
     * @param {Object} opts
     * @param {string} opts.color — цвет змеи
     * @param {'logo'|'bottom-right'} opts.start — точка старта
     */
    constructor({ color = '#6C26B2', start = 'bottom-right' } = {}) {
      this.color     = color;
      this.thickness = 4;
      this.lengthPx  = 16;
      this.maxLength = this.lengthPx / this.thickness;
      this.speed     = 1;

      // стартовая позиция
      const logoRect    = document.querySelector('.header__logo')?.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();

      let startX, startY;
      if (start === 'logo' && logoRect) {
        startX = logoRect.left  - wrapperRect.left + (logoRect.width  - this.thickness) / 2;
        startY = logoRect.bottom - wrapperRect.top  + 10;
      } else {
        const scrollX = window.pageXOffset;
        const scrollY = window.pageYOffset;
        startX = scrollX + window.innerWidth  - this.thickness - 10 - wrapperRect.left;
        startY = scrollY + window.innerHeight - this.thickness - 10 - wrapperRect.top;
      }

      // создаём начальные сегменты
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
      const cx   = head.x + this.thickness / 2;
      const cy   = head.y + this.thickness / 2;

      // найти ближайшую точку
      let nearest = null, best = Infinity;
      for (const p of points) {
        const dx = (p.x + POINT_SIZE/2) - cx;
        const dy = (p.y + POINT_SIZE/2) - cy;
        const d2 = dx*dx + dy*dy;
        if (d2 < best) { best = d2; nearest = p; }
      }

      // вектор движения по 4 направлениям
      let dx = 0, dy = 0;
      if (nearest) {
        dx = nearest.x - head.x;
        dy = nearest.y - head.y;
      }
      if (Math.abs(dx) > Math.abs(dy)) {
        dx = Math.sign(dx); dy = 0;
      } else {
        dx = 0; dy = Math.sign(dy);
      }

      // переместить голову с переносом по тору
      head.x = (head.x + dx * this.speed + canvas.width )  % canvas.width;
      head.y = (head.y + dy * this.speed + canvas.height) % canvas.height;

      // обновить сегменты
      this.segments.unshift({ x: head.x, y: head.y });
      if (this.segments.length > this.maxLength) {
        this.segments.pop();
      }

      // «съесть» точку при соприкосновении
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

      // регенерировать, когда точки кончатся
      if (points.length === 0) genPoints();
    }

    draw() {
      ctx.fillStyle = this.color;
      for (const seg of this.segments) {
        ctx.fillRect(seg.x, seg.y, this.thickness, this.thickness);
      }
    }
  }

  // создаём две змейки:
  const snakeLogo       = new Snake({ color: '#6C26B2', start: 'logo' });
  const snakeBottomRight = new Snake({ color: '#FFD700', start: 'bottom-right' });

  // 5) Цикл анимации
  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // рисуем точки
    ctx.fillStyle = 'rgba(62,7,137,0.5)';
    for (const p of points) {
      ctx.fillRect(p.x, p.y, POINT_SIZE, POINT_SIZE);
    }

    // обновляем и рисуем змейки
    snakeLogo.step();        snakeLogo.draw();
    snakeBottomRight.step(); snakeBottomRight.draw();

    requestAnimationFrame(loop);
  })();
});