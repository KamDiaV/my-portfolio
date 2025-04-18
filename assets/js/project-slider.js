document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.slider');
  sliders.forEach(slider => {
    const slides = slider.querySelectorAll('.slider__slide');
    const thumbs = slider.querySelectorAll('.slider__thumb');
    let current = 0;

    function showSlide(idx) {
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      thumbs.forEach((t, i) => t.classList.toggle('active', i === idx));
      current = idx;
    }

    // thumbnail click
    thumbs.forEach(thumb =>
      thumb.addEventListener('click', () => {
        showSlide(parseInt(thumb.dataset.index));
      })
    );

    // auto‑advance
    setInterval(() => {
      let next = (current + 1) % slides.length;
      showSlide(next);
    }, 4000);

    // init
    showSlide(0);
  });
});