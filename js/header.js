document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  if (!header) return;

  // Menü toggle
  const menuIcon = header.querySelector('.menu-icon');
  const menu = header.querySelector('#menu');

  if (menuIcon && menu) {
    menuIcon.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }

  // Sayfa alt klasörde mi?
  const isSubPage = location.pathname.split('/').length > 2;

  if (isSubPage) {
    header.querySelectorAll('a').forEach(link => {
      if (!link.getAttribute('href').startsWith('../')) {
        link.setAttribute('href', '../' + link.getAttribute('href'));
      }
    });
  }
});
