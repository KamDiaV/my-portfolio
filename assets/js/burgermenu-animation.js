document.addEventListener('DOMContentLoaded', () => {
  const btn     = document.getElementById('burger');
  const nav     = document.getElementById('menu');
  const overlay = nav.querySelector('.nav__overlay');
  const list    = nav.querySelector('.nav__list');

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const opening = !nav.classList.contains('is-open');

    if (opening) {
      nav.classList.add('is-open');
      btn.classList.add('is-open');
      list.style.display = 'none';
      list.style.opacity = '0';

      overlay.style.transformOrigin = 'top right';
      anime({
        targets: overlay,
        scale: [0, 1],
        duration: 600,
        easing: 'easeOutQuad'
      });

      setTimeout(() => {
        list.style.display = 'flex';
        anime({
          targets: list,
          opacity: [0, 1],
          duration: 300,
          easing: 'linear'
        });
      }, 400);
    } else {
      anime({
        targets: list,
        opacity: [1, 0],
        duration: 100,
        easing: 'linear',
        complete: () => {
          list.style.display = 'none';
          list.style.opacity = '';
        }
      });

      overlay.style.transformOrigin = 'top right';
      anime({
        targets: overlay,
        scale: [1, 0],
        duration: 600,
        easing: 'easeInQuad',
        complete: () => {
          nav.classList.remove('is-open');
          btn.classList.remove('is-open');
          overlay.style.transform = 'scale(0)';
        }
      });
    }
  });

  document.addEventListener('click', e => {
    if (
      nav.classList.contains('is-open') &&
      !nav.contains(e.target) &&
      !btn.contains(e.target)
    ) {
      btn.click();
    }
  });

  function resetListStyles() {
    if (!nav.classList.contains('is-open')) {
      list.style.display = '';
      list.style.opacity = '';
    }
  }

  btn.addEventListener('click', () => {
    if (!nav.classList.contains('is-open')) resetListStyles();
  });

  window.addEventListener('resize', resetListStyles);
});
