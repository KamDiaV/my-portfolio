document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });
});
