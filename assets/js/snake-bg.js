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

  // 3) Генерация 100 серых точек‑пикселей 4×4
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

  // 4) Класс змейки с учётом препятствий (segments другой змеи)
  class Snake {
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

      if (start === 'bottom-right') {
        const W = wrapper.clientWidth, H = wrapper.clientHeight, M = 10, t = this.thickness;
        startX = W - t - M;
        startY = H - t - M;
      } else if (start === 'logo' && logoRect) {
        startX = logoRect.left   - wrapperRect.left + (logoRect.width  - this.thickness) / 2;
        startY = logoRect.bottom - wrapperRect.top  + 10;
      } else {
        startX = Math.random() * (canvas.width  - this.thickness);
        startY = Math.random() * (canvas.height - this.thickness);
      }

      this.segments = [];
      for (let i = 0; i < this.maxLength; i++) {
        this.segments.push({ x: startX, y: startY + i * this.thickness });
      }
    }

    /**
     * Один шаг змейки
     * @param {Array<{x:number,y:number}>} obstacles — сегменты другой змеи
     */
    step(obstacles = []) {
      const head = this.segments[0];
      const cx   = head.x + this.thickness/2;
      const cy   = head.y + this.thickness/2;
    
      // 1) Ближайшая «еда»
      let nearest = null, best = Infinity;
      for (const p of points) {
        const dx0 = (p.x + POINT_SIZE/2) - cx;
        const dy0 = (p.y + POINT_SIZE/2) - cy;
        const d2  = dx0*dx0 + dy0*dy0;
        if (d2 < best) { best = d2; nearest = p; }
      }
    
      // 2) Направление к еде (по 4 направлениям)
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
    
      // 3) Новая координата головы (с тором)
      let newX = (head.x + dx*this.speed + canvas.width )  % canvas.width;
      let newY = (head.y + dy*this.speed + canvas.height) % canvas.height;
    
      // 4) Если подползли бы ближе 8px к любой точке obstacles
      const tooClose = obstacles.some(seg => {
        const ddx = seg.x - newX, ddy = seg.y - newY;
        return Math.hypot(ddx, ddy) < 8;
      });
      if (tooClose) {
        // найдём ближайший сегмент-препятствие
        let nearestObs = null; best = Infinity;
        for (const seg of obstacles) {
          const ddx = seg.x - head.x, ddy = seg.y - head.y;
          const d2  = ddx*ddx + ddy*ddy;
          if (d2 < best) { best = d2; nearestObs = seg; }
        }
        if (nearestObs) {
          const odx = nearestObs.x - head.x;
          const ody = nearestObs.y - head.y;
          // если препятствие в большей степени по X, уходим по Y
          if (Math.abs(odx) > Math.abs(ody)) {
            dy = ody > 0 ? -1 : 1;
            dx = 0;
          } else {
            dx = odx > 0 ? -1 : 1;
            dy = 0;
          }
          newX = (head.x + dx*this.speed + canvas.width )  % canvas.width;
          newY = (head.y + dy*this.speed + canvas.height) % canvas.height;
        }
      }
    
      // 5) Обновляем сегменты
      this.segments.unshift({ x: newX, y: newY });
      if (this.segments.length > this.maxLength) {
        this.segments.pop();
      }
    
      // 6) «Съедаем» точку
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (
          p.x < newX + this.thickness &&
          p.x + POINT_SIZE > newX &&
          p.y < newY + this.thickness &&
          p.y + POINT_SIZE > newY
        ) {
          points.splice(i, 1);
          this.maxLength++;
          break;
        }
      }
    
      // 7) Регенерировать, если точки кончились
      if (points.length === 0) genPoints();
    }

    draw() {
      ctx.fillStyle = this.color;
      for (const seg of this.segments) {
        ctx.fillRect(seg.x, seg.y, this.thickness, this.thickness);
      }
    }
  }

  // 5) Создаём две змейки
  const snakeLogo        = new Snake({ color: '#6C26B2', start: 'logo' });
  const snakeBottomRight = new Snake({ color: '#FFD700', start: 'bottom-right' });

  // 6) Главный цикл анимации
  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // рисуем точки
    ctx.fillStyle = 'rgba(62,7,137,0.5)';
    for (const p of points) {
      ctx.fillRect(p.x, p.y, POINT_SIZE, POINT_SIZE);
    }

    // шаг и отрисовка (каждая «видит» сегменты другой)
    snakeLogo.step(snakeBottomRight.segments);
    snakeBottomRight.step(snakeLogo.segments);
    snakeLogo.draw();
    snakeBottomRight.draw();

    requestAnimationFrame(loop);
  })();
});