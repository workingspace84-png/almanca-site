// js/exercises-multi.js
document.addEventListener('DOMContentLoaded', () => {

  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const feedbackEl = document.getElementById('feedback');
  const scoreEl = document.getElementById('score');

  let questions = [];
  let currentIndex = 0;
  let correctCount = 0;
  let locked = false;

  const dataFile = window.EXERCISE_DATA || 'exercise-template.json';

  fetch(dataFile)
    .then(res => res.json())
    .then(data => {
      questions = [...data]; // kopya al
      showQuestion();
    });

  function showQuestion() {
    locked = false;
    feedbackEl.innerHTML = '';
    optionsEl.innerHTML = '';

    if (questions.length === 0) {
      questionEl.innerHTML = '🎉 Tebrikler! Tüm soruları doğru yaptın.';
      scoreEl.innerText = `Doğru: ${correctCount}`;
      return;
    }

    const q = questions[0];
    questionEl.innerHTML = q.sentence;

    q.options.forEach(option => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = option;

      btn.addEventListener('click', () => handleAnswer(option, q));

      optionsEl.appendChild(btn);
    });

    scoreEl.innerText = `Kalan soru: ${questions.length} | Doğru: ${correctCount}`;
  }

  function handleAnswer(selected, question) {
    if (locked) return;
    locked = true;

    if (selected === question.answer) {
      correctCount++;
      feedbackEl.innerHTML = `
        <strong>Richtig ✅</strong><br>
        ${question.explanation}
      `;

      // Doğruysa → soruyu listeden çıkar
      questions.shift();

    } else {
      feedbackEl.innerHTML = `
        <strong>Falsch ❌</strong><br>
        ${question.explanation}
      `;

      // Yanlışsa → soruyu sona ekle
      questions.push(questions.shift());
    }

    setTimeout(showQuestion, 1800);
  }

});
