let currentQuestion = 0;
let score = 0;
let questions = [];

// ===== EGZERSİZ VARSA ÇALIŞSIN =====
if (document.getElementById('question')) {
  fetch('praepositionen.json')
    .then(res => res.json())
    .then(data => {
      questions = data;
      showQuestion();
    });
}

function showQuestion() {
  const questionEl = document.getElementById('question');
  const input = document.getElementById('answerInput');
  const feedback = document.getElementById('feedback');
  const scoreDiv = document.getElementById('score');

  if (!questionEl) return;

  if (currentQuestion < questions.length) {
    questionEl.innerHTML = questions[currentQuestion].sentence;
    input.value = '';
    feedback.innerText = '';
    scoreDiv.innerText = `Skor: ${score}/${questions.length}`;
  } else {
    questionEl.innerText = "Tebrikler! Alıştırma tamamlandı.";
    input.style.display = 'none';
    document.getElementById('submitBtn').style.display = 'none';
    feedback.innerText = `Skorunuz: ${score}/${questions.length}`;
  }
}

// ===== HEADER / FOOTER =====
document.addEventListener('DOMContentLoaded', () => {

  const isSubPage =
    window.location.pathname.includes('/exercises/') ||
    window.location.pathname.includes('/themen/');

  const headerPath = isSubPage ? '../header.html' : 'header.html';
  const footerPath = isSubPage ? '../footer.html' : 'footer.html';

  // HEADER
  fetch(headerPath)
    .then(res => res.text())
    .then(html => {
      document.getElementById('header-placeholder').innerHTML = html;

      const menuIcon = document.querySelector('.menu-icon');
      const menu = document.getElementById('menu');

      if (menuIcon && menu) {
        menuIcon.addEventListener('click', () => {
          menu.classList.toggle('hidden');
        });
      }
    });

  // FOOTER
  fetch(footerPath)
    .then(res => res.text())
    .then(html => {
      const footer = document.getElementById('footer-placeholder');
      if (footer) footer.innerHTML = html;
    });

});
