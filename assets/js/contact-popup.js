document.addEventListener('DOMContentLoaded', () => {
  const popup     = document.getElementById('contactPopup');
  const openBtn   = document.querySelector('.button');          // кнопка "Contact Me"
  const closeBtn  = popup.querySelector('.contact-popup__close');
  const backdrop  = popup.querySelector('.contact-popup__backdrop');

  function show() {
    popup.classList.add('is-visible');
  }
  function hide() {
    popup.classList.remove('is-visible');
  }

  // открыть по клику
  openBtn.addEventListener('click', show);
  // закрыть по клику на крестик
  closeBtn.addEventListener('click', hide);
  // закрыть по клику на задний фон
  backdrop.addEventListener('click', hide);
  // закрыть по нажатию Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('is-visible')) {
      hide();
    }
  });
});
