document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('scroll-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;
    const docH    = document.documentElement.scrollHeight;

    if (scrollY + windowH >= docH * 0.95) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
