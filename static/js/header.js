document.addEventListener('DOMContentLoaded', () => {
  const langButtons = document.querySelectorAll('.lang-btn');

  // 1️⃣ URL'den lang parametresini al
  const urlParams = new URLSearchParams(window.location.search);
  let selectedLang = urlParams.get('lang');

  // 2️⃣ Eğer URL'de yoksa localStorage'dan al, yoksa 'en'
  if (!selectedLang) {
    selectedLang = localStorage.getItem('selectedLanguage') || 'en';
  } else {
    // URL parametresi varsa localStorage'ı güncelle
    localStorage.setItem('selectedLanguage', selectedLang);
  }

  // 3️⃣ Header linklerindeki lang parametresini güncelle
  document.querySelectorAll('a.header-link').forEach(link => {
    const url = new URL(link.href, window.location.origin);
    url.searchParams.set('lang', selectedLang);
    link.href = url.toString();
  });

  // 4️⃣ Sayfadaki dil elementlerini göster/gizle
  function showLanguage(lang) {
    document.querySelectorAll('.lang-en').forEach(el => el.style.display = (lang === 'en') ? 'inline' : 'none');
    document.querySelectorAll('.lang-tr').forEach(el => el.style.display = (lang === 'tr') ? 'inline' : 'none');
  }

  // 5️⃣ Başlangıçta dili uygula
  showLanguage(selectedLang);

  // 6️⃣ Dil butonları event listener
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const newLang = btn.getAttribute('data-lang');
      localStorage.setItem('selectedLanguage', newLang);

      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLang);
      window.location.href = url.toString();
    });
  });
});
