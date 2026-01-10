// js/exercises.js
document.addEventListener('DOMContentLoaded', () => {

  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const feedbackEl = document.getElementById('feedback');
  const scoreEl = document.getElementById('score');
  const nextBtn = document.getElementById('nextBtn');

  let questions = [];
  let currentQuestion = 0;
  let score = 0;
  let answered = false;

  const dataFile = window.EXERCISE_DATA || 'exercise-template.json';

  fetch(dataFile)
    .then(res => res.json())
    .then(data => {
      questions = data;
      showQuestion();
    });

  function showQuestion() {
    const q = questions[currentQuestion];
    answered = false;

    questionEl.innerHTML = q.sentence;
    optionsEl.innerHTML = '';
    feedbackEl.innerHTML = '';
    nextBtn.style.display = 'none';

    q.options.forEach(option => {
      const btn = document.createElement('button');
      btn.textContent = option;
      btn.className = 'option-btn';

      btn.addEventListener('click', () => handleAnswer(option, q));

      optionsEl.appendChild(btn);
    });

    scoreEl.textContent = `Skor: ${score}/${questions.length}`;
  }

  function handleAnswer(selected, q) {
    if (answered) return;
    answered = true;

    if (selected === q.answer) {
      score++;
      feedbackEl.innerHTML = `
        <strong>Doğru ✅</strong><br>
        <strong>${q.answer}</strong> doğru cevaptır.<br>
        ${q.explanation}
      `;
    } else {
      feedbackEl.innerHTML = `
        <strong>Yanlış ❌</strong><br>
        Senin seçimin: <strong>${selected}</strong><br>
        Doğru cevap: <strong>${q.answer}</strong><br>
        ${q.explanation}
      `;
    }

    nextBtn.style.display = 'inline-block';
    scoreEl.textContent = `Skor: ${score}/${questions.length}`;
  }

  nextBtn.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      questionEl.textContent = 'Bitti 🎉';
      optionsEl.innerHTML = '';
      feedbackEl.innerHTML = `Toplam skorun: ${score}/${questions.length}`;
      nextBtn.style.display = 'none';
    }
  });

});
