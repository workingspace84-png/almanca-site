// js/exercises.js

const submitBtn = document.getElementById('submitBtn');
const input = document.getElementById('answerInput');
const feedback = document.getElementById('feedback');
const scoreDiv = document.getElementById('score');
const explanation = document.getElementById('explanation');

let currentQuestion = 0;
let score = 0;
let questions = [];

if (submitBtn) {

  // Özel karakter paneli
  const charPanel = document.getElementById('char-panel');

  if (input && charPanel) {
    const specialChars = ['ä', 'ö', 'ü', 'ß'];
    charPanel.innerHTML = ''; // temizle

    specialChars.forEach(char => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = char;
      btn.addEventListener('click', () => {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        input.value = input.value.slice(0, start) + char + input.value.slice(end);
        input.focus();
        input.selectionStart = input.selectionEnd = start + 1;
      });
      charPanel.appendChild(btn);
    });
  }

  // Soruları JSON'dan çek
  fetch('praepositionen.json')
    .then(res => res.json())
    .then(data => {
      questions = data;
      showQuestion();
    });

  function showQuestion() {
    if (currentQuestion < questions.length) {
      const q = questions[currentQuestion];
      document.getElementById('question').innerHTML = `${q.sentence}<br><em>${q.translation}</em>`;
      input.value = '';
      feedback.innerHTML = '';
      explanation.innerText = '';
      scoreDiv.innerText = `Skor: ${score}/${questions.length}`;
      input.focus();
    } else {
      document.getElementById('question').innerText = "Bitti 🎉";
      submitBtn.style.display = 'none';
      charPanel.style.display = 'none';
    }
  }

  function submitAnswer() {
    if (!input.value.trim()) return;

    const userAnswer = input.value.trim();
    const correctAnswer = questions[currentQuestion].answer;
    const explanationText = questions[currentQuestion].explanation || '';

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      score++;
      feedback.innerHTML = `
        <strong>Richtig ✅</strong><br>
        Dein Antwort: ${userAnswer}<br>
        Richtige Antwort: ${correctAnswer}<br>
        Erklärung: ${explanationText}
      `;
    } else {
      feedback.innerHTML = `
        <strong>Falsch ❌</strong><br>
        Dein Antwort: ${userAnswer}<br>
        Richtige Antwort: ${correctAnswer}<br>
        Erklärung: ${explanationText}
      `;
    }

    currentQuestion++;
    setTimeout(showQuestion, 1500);
  }

  // Click ile gönder
  submitBtn.addEventListener('click', submitAnswer);

  // Enter ile gönder
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitAnswer();
    }
  });

}
