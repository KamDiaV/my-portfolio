document.addEventListener('DOMContentLoaded', () => {
  const icons = document.querySelectorAll('.skills__item img');

  icons.forEach((icon, i) => {
    anime({
      targets: icon,
      translateY: [0, -10],
      scale: [1, 1.05],
      duration: 2000 + i * 200,      
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      delay: i * 100
    });
  });
});