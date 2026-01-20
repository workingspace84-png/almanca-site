document.addEventListener("DOMContentLoaded", () => {
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const feedbackEl = document.getElementById("feedback");
  const scoreEl = document.getElementById("score");
  const nextBtn = document.getElementById("nextBtn");

  const lang = window.LANGUAGE || "en";  // URL param veya default en
  let questions = [];
  let currentIndex = 0;
  let correctCount = 0;
  let locked = false;

  // Güvenlik: EXERCISE_DATA yoksa sessizce dur
  if (!window.EXERCISE_DATA) {
    console.error("EXERCISE_DATA is not defined");
    return;
  }

  fetch(window.EXERCISE_DATA)
    .then(res => res.json())
    .then(data => {
      questions = Array.isArray(data) ? data : [data];
      showQuestion();
    })
    .catch(err => {
      questionEl.innerText = "Failed to load exercises.";
      console.error(err);
    });

  function showQuestion() {
    if (currentIndex >= questions.length) {
      questionEl.innerHTML = window.I18N?.completedMessage || "🎉 All exercises completed!";
      optionsEl.innerHTML = "";
      feedbackEl.innerHTML = "";
      nextBtn.style.display = "none";
      scoreEl.innerText = `Correct answers: ${correctCount}`;
      return;
    }

    locked = false;
    optionsEl.innerHTML = "";
    feedbackEl.innerHTML = "";
    nextBtn.style.display = "none";

    const q = questions[currentIndex];

    // Her zaman Almanca cümleyi göster
    questionEl.innerHTML = q.sentence.de || "";

    // Kullanıcı dilinde çeviri varsa göster
    if (q.translation && q.translation[lang]) {
      questionEl.innerHTML += `<br><em style="color:#aaa; font-size:0.95rem;">${q.translation[lang]}</em>`;
    }

    // Seçenekleri güvenli şekilde hazırla
    const optionsList = (q.options && q.options[lang]) ? q.options[lang] : [];
    optionsList.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.className = "option-btn";

      btn.addEventListener("click", () => handleAnswer(option, q, btn));
      optionsEl.appendChild(btn);
    });

    // Progress göstergesi
    scoreEl.innerText = `Question ${currentIndex + 1} / ${questions.length} | Correct: ${correctCount}`;
  }

  function handleAnswer(selected, question, btn) {
    if (locked) return;
    locked = true;

    // Tüm seçenekleri kilitle
    document.querySelectorAll("#options button").forEach(b => b.disabled = true);

    // Doğru cevabı güvenli şekilde al
    const correctAnswer = (question.answer && question.answer[lang]) ? question.answer[lang] : "";

    // Açıklamayı güvenli şekilde al
    const explanation = (question.explanation && question.explanation[lang]) ? question.explanation[lang] : "";

    if (selected === correctAnswer) {
      btn.classList.add("option-correct");
      correctCount++;
      feedbackEl.innerHTML = `
        ✅ <strong>Correct</strong><br>
        <em>Explanation:</em> ${explanation}<br>
      `;
    } else {
      btn.classList.add("option-wrong");
      feedbackEl.innerHTML = `
        ❌ <strong>Incorrect</strong><br>
        <em>Explanation:</em> ${explanation}<br>
      `;
    }

    // i18n ile Next Question metni dinamik
    nextBtn.innerText = window.I18N?.next || "Next Question";
    nextBtn.style.display = "inline-block";
  }

  nextBtn.addEventListener("click", () => {
    currentIndex++;
    showQuestion();
  });
});
