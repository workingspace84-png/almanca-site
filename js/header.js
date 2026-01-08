document.addEventListener('DOMContentLoaded', () => {
  const menuIcon = document.querySelector('.menu-icon');
  const menu = document.getElementById('menu');

  if (menuIcon && menu) {
    menuIcon.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }
});
