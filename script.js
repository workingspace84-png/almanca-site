let currentQuestion = 0;
let score = 0;
let questions = [];

// JSON dosyasını çek
fetch('praepositionen.json')
  .then(res => res.json())
  .then(data => {
    questions = data;
    showQuestion();
  });

function showQuestion() {
  const questionEl = document.getElementById('question');
  const input = document.getElementById('answerInput');
  const feedback = document.getElementById('feedback');
  const scoreDiv = document.getElementById('score');

  if(currentQuestion < questions.length) {
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

document.getElementById('submitBtn').addEventListener('click', () => {
  const input = document.getElementById('answerInput');
  const userAnswer = input.value.trim().toLowerCase();
  const correctAnswer = questions[currentQuestion].answer.toLowerCase();
  const feedback = document.getElementById('feedback');

  if(userAnswer === correctAnswer) {
    feedback.innerText = "Richtig! 🎉";
    feedback.style.color = "green";
    score++;
  } else {
    feedback.innerText = `Falsch! İpucu: ${questions[currentQuestion].hint}`;
    feedback.style.color = "red";
  }

  currentQuestion++;
  setTimeout(showQuestion, 1000);

  const scoreDiv = document.getElementById('score');
  scoreDiv.innerText = `Skor: ${score}/${questions.length}`;
});

// ===== Dinamik header ve footer yükleme =====
let currentPath = window.location.pathname;

let headerPath, footerPath;

// Eğer sayfa alt klasördeyse '../', ana dizinse direkt
if(currentPath.includes('/exercises/') || currentPath.includes('/themen/')) {
  headerPath = '../header.html';
  footerPath = '../footer.html';
} else {
  headerPath = 'header.html';
  footerPath = 'footer.html';
}

// Header yükle
fetch(headerPath)
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;

    const menuIcon = document.querySelector('#header-placeholder .menu-icon');
    const menu = document.querySelector('#header-placeholder #menu');

    if(menuIcon && menu) {
      menuIcon.addEventListener('click', () => {
        menu.classList.toggle('hidden');
      });
    }
  });

// Footer yükle
fetch(footerPath)
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer-placeholder').innerHTML = data;
  });

