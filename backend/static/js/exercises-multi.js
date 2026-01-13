document.addEventListener('DOMContentLoaded', () => {
  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const feedbackEl = document.getElementById('feedback');
  const scoreEl = document.getElementById('score');
  const nextBtn = document.getElementById('nextBtn');

  let questions = [];
  let currentIndex = 0;
  let correctCount = 0;
  let locked = false;

  // Backend API’den veri çek
  fetch(window.EXERCISE_DATA)
    .then(res => res.json())
    .then(data => {
      questions = [...data];
      showQuestion();
    });

  function showQuestion() {
    if (questions.length === 0) {
      questionEl.innerHTML = '🎉 Tebrikler! Tüm soruları tamamladın.';
      scoreEl.innerText = `Doğru: ${correctCount}`;
      optionsEl.innerHTML = '';
      feedbackEl.innerHTML = '';
      nextBtn.style.display = 'none';
      return;
    }

    locked = false;
    feedbackEl.innerHTML = '';
    optionsEl.innerHTML = '';
    nextBtn.style.display = 'none';

    const q = questions[currentIndex];
    questionEl.innerHTML = q.sentence.de; // Almanca gösteriyoruz

    q.options.de.forEach(option => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = option;

      btn.addEventListener('click', () => handleAnswer(option, q, btn));

      optionsEl.appendChild(btn);
    });

    scoreEl.innerText = `Soru: ${currentIndex + 1}/${questions.length} | Doğru: ${correctCount}`;
  }

  function handleAnswer(selected, question, btn) {
    if (locked) return;
    locked = true;

    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

    if (selected === question.answer.de) {
      correctCount++;
      btn.classList.add('option-correct');
      feedbackEl.innerHTML = `<strong>Richtig ✅</strong><br>${question.explanation.de}`;
    } else {
      btn.classList.add('option-wrong');
      feedbackEl.innerHTML = `<strong>Falsch ❌</strong><br>${question.explanation.de}`;
    }

    nextBtn.style.display = 'inline-block';
  }

  nextBtn.addEventListener('click', () => {
    const lastAnswerCorrect = document.querySelector('.option-correct');

    if (lastAnswerCorrect) {
      questions.splice(currentIndex, 1); // doğruysa çıkar
    } else {
      currentIndex++;
      if (currentIndex >= questions.length) currentIndex = 0;
    }

    showQuestion();
  });
});
