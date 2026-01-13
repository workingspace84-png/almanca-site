// js/exercises.js
document.addEventListener('DOMContentLoaded', () => {

  const submitBtn = document.getElementById('submitBtn');
  const input = document.getElementById('answerInput');
  const feedback = document.getElementById('feedback');
  const scoreDiv = document.getElementById('score');

  let currentQuestion = 0;
  let score = 0;
  let questions = [];
  let answered = false;

  if (!submitBtn || !input) return;

  /* ===============================
     ÖZEL KARAKTER PANELİ
  =============================== */
  const charPanel = document.getElementById('char-panel');

  if (charPanel) {
    const specialChars = ['ä', 'ö', 'ü', 'ß'];
    charPanel.innerHTML = '';

    specialChars.forEach(char => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = char;
      btn.addEventListener('click', () => {
        const start = input.selectionStart;
        const end = input.selectionEnd;
        input.value =
          input.value.slice(0, start) +
          char +
          input.value.slice(end);
        input.focus();
        input.selectionStart = input.selectionEnd = start + 1;
      });
      charPanel.appendChild(btn);
    });
  }

  /* ===============================
     JSON YÜKLEME
  =============================== */
  const dataFile = window.EXERCISE_DATA || 'praepositionen.json';

  fetch(dataFile)
    .then(res => res.json())
    .then(data => {
      questions = data;
      showQuestion();
    });

  function showQuestion() {
    if (currentQuestion < questions.length) {
      const q = questions[currentQuestion];
      document.getElementById('question').innerHTML =
        `${q.sentence}<br><em>${q.translation || ''}</em>`;

      input.value = '';
      feedback.innerHTML = '';
      scoreDiv.innerText = `Skor: ${score}/${questions.length}`;
      answered = false;
      input.focus();
    } else {
      document.getElementById('question').innerText = 'Bitti 🎉';
      submitBtn.style.display = 'none';
      if (charPanel) charPanel.style.display = 'none';
    }
  }

  function submitAnswer() {

    if (answered) {
      currentQuestion++;
      showQuestion();
      return;
    }

    if (!input.value.trim()) return;

    const userAnswer = input.value.trim();
    const q = questions[currentQuestion];
    const correctAnswer = q.answer;
    const explanationText = q.explanation || '';

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      score++;
      feedback.innerHTML = `
        <strong>Richtig ✅</strong><br>
        Deine Antwort: <strong>${userAnswer}</strong><br>
        Richtige Antwort: <strong>${correctAnswer}</strong><br>
        Erklärung: ${explanationText}
      `;
    } else {
      feedback.innerHTML = `
        <strong>Falsch ❌</strong><br>
        Deine Antwort: <strong>${userAnswer}</strong><br>
        Richtige Antwort: <strong>${correctAnswer}</strong><br>
        Erklärung: ${explanationText}
      `;
    }

    answered = true;
  }

  submitBtn.addEventListener('click', submitAnswer);

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitAnswer();
    }
  });

});
