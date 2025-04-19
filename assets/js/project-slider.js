// project‑slider.js
document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.slider');

  sliders.forEach(slider => {
    const slides = Array.from(slider.querySelectorAll('.slider__slide'));
    const thumbs = Array.from(slider.querySelectorAll('.slider__thumb'));
    const main   = slider.querySelector('.slider__main');
    let current  = 0;
    let interval;
    let startX   = 0;

    function showSlide(idx) {
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      thumbs.forEach((t, i) => t.classList.toggle('active', i === idx));
      current = idx;
    }

    function nextSlide() {
      showSlide((current + 1) % slides.length);
    }

    function prevSlide() {
      showSlide((current - 1 + slides.length) % slides.length);
    }

    function resetInterval() {
      clearInterval(interval);
      interval = setInterval(nextSlide, 4000);
    }

    // клик по миниатюре
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', e => {
        const idx = parseInt(thumb.dataset.index, 10);
        showSlide(idx);
        resetInterval();
      });
    });

    // свайп на мобильных
    main.addEventListener('touchstart', e => {
      clearInterval(interval);
      startX = e.touches[0].pageX;
    });
    main.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].pageX - startX;
      if (dx > 50) prevSlide();
      else if (dx < -50) nextSlide();
      resetInterval();
    });

    // пауза при наведении мыши (desktop)
    slider.addEventListener('mouseenter', () => clearInterval(interval));
    slider.addEventListener('mouseleave', resetInterval);

    // стартовая инициализация
    showSlide(0);
    resetInterval();
  });
});