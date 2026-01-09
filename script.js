// script.js - root için sadece genel site işlevleri

// HEADER FETCH
fetch('header.html')
  .then(res => res.text())
  .then(data => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
      headerPlaceholder.innerHTML = data;
    }
  });

// Buraya başka site genel JS kodları eklenebilir
// Örn: footer dinamik işlemler, global event listener vs.
