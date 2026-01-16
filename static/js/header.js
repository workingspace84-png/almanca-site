document.addEventListener('DOMContentLoaded', () => {

  const langButtons = document.querySelectorAll('.lang-btn');

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      localStorage.setItem('selectedLanguage', selectedLang);

      const url = new URL(window.location.href);
      url.searchParams.set('lang', selectedLang);
      window.location.href = url.toString();
    });
  });

});
