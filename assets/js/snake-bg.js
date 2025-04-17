// snake-bg.js
document.addEventListener('DOMContentLoaded', () => {
  // ——————————————————————————————————————————————
  // 1) Получаем canvas и wrapper
  // ——————————————————————————————————————————————
  const canvas  = document.getElementById('snake-bg');
  const wrapper = document.querySelector('.wrapper');
  if (!canvas || !wrapper) return;

  // Абсолютное позиционирование относительно wrapper
  wrapper.style.position = 'relative';
  Object.assign(canvas.style, {
    position:      'absolute',
    top:           '0',
    left:          '0',
    pointerEvents: 'none',
    zIndex:        '-1'
  });
  const ctx = canvas.getContext('2d');

  // ——————————————————————————————————————————————
  // 2) Подгоняем размеры canvas к wrapper
  // ——————————————————————————————————————————————
  function resize() {
    const rect = wrapper.getBoundingClientRect();
    canvas.width  = rect.width;
    canvas.height = rect.height;
  }
  window.addEventListener('resize', resize);
  resize();

  // ——————————————————————————————————————————————
  // 3) Генерируем 100 точек‑пикселей 4×4
  // ——————————————————————————————————————————————
  const POINT_SIZE = 4;
  const points = [];
  for (let i = 0; i < 100; i++) {
    points.push({
      x: Math.random() * (canvas.width  - POINT_SIZE),
      y: Math.random() * (canvas.height - POINT_SIZE)
    });
  }

  // ——————————————————————————————————————————————
  // 4) Класс «змейка»
  // ——————————————————————————————————————————————
  class Snake {
    constructor() {
      this.SIZE      = 4;                      // размер сегмента
      this.maxLength = 4;                      // стартовая длина
      this.speed     = 1.5;                    // скорость
      this.angle     = Math.random() * Math.PI * 2;

      // позиция логотипа (чтобы начать прямо под ним)
      const logo = document.querySelector('.header__logo');
      if (logo) {
        const r = logo.getBoundingClientRect();
        // учесть смещение wrapper!
        const wrapperRect = wrapper.getBoundingClientRect();
        this.segments = [{
          x: r.left - wrapperRect.left + (r.width - this.SIZE) / 2,
          y: r.bottom - wrapperRect.top + 10  // 10px ниже логотипа
        }];
      } else {
        // fallback: случайная точка
        this.segments = [{
          x: Math.random() * (canvas.width  - this.SIZE),
          y: Math.random() * (canvas.height - this.SIZE)
        }];
      }
    }

    step() {
      const head = this.segments[0];
      const cx   = head.x + this.SIZE/2;
      const cy   = head.y + this.SIZE/2;

      // 4.1) Найти ближайшую точку
      let nearest = null, bestDist2 = Infinity;
      for (const p of points) {
        const dx = (p.x + POINT_SIZE/2) - cx;
        const dy = (p.y + POINT_SIZE/2) - cy;
        const d2 = dx*dx + dy*dy;
        if (d2 < bestDist2) {
          bestDist2 = d2;
          nearest   = p;
        }
      }

      // 4.2) Вектор движения
      let dx, dy;
      if (nearest) {
        dx = nearest.x - head.x;
        dy = nearest.y - head.y;
        const len = Math.hypot(dx, dy) || 1;
        dx /= len; dy /= len;
      } else {
        dx = Math.cos(this.angle);
        dy = Math.sin(this.angle);
      }
      this.angle = Math.atan2(dy, dx);

      // 4.3) Движение головы
      head.x += dx * this.speed;
      head.y += dy * this.speed;

      // 4.4) Тор (перенос через края)
      head.x = (head.x + canvas.width)  % canvas.width;
      head.y = (head.y + canvas.height) % canvas.height;

      // 4.5) Обновление сегментов
      this.segments.unshift({ x: head.x, y: head.y });
      if (this.segments.length > this.maxLength) {
        this.segments.pop();
      }

      // 4.6) Съесть точку при столкновении головой
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (
          p.x < head.x + this.SIZE &&
          p.x + POINT_SIZE > head.x &&
          p.y < head.y + this.SIZE &&
          p.y + POINT_SIZE > head.y
        ) {
          points.splice(i, 1);
          this.maxLength++;
          break;
        }
      }
    }

    draw() {
      ctx.fillStyle = '#3E0789'; // secondary‑color
      for (const seg of this.segments) {
        ctx.fillRect(seg.x, seg.y, this.SIZE, this.SIZE);
      }
    }
  }

  const snake = new Snake();

  // ——————————————————————————————————————————————
  // 5) Основной анимационный цикл
  // ——————————————————————————————————————————————
  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 5.1) Точки
    ctx.fillStyle = 'rgba(62, 7, 137, 0.5)';
    for (const p of points) {
      ctx.fillRect(p.x, p.y, POINT_SIZE, POINT_SIZE);
    }

    // 5.2) Шаг + отрисовка змейки
    snake.step();
    snake.draw();

    requestAnimationFrame(loop);
  })();
});