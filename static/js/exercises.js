document.addEventListener("DOMContentLoaded", () => {
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const feedbackEl = document.getElementById("feedback");
  const scoreEl = document.getElementById("score");
  const nextBtn = document.getElementById("nextBtn");

  const lang = window.LANGUAGE || "tr"; // URL param veya default tr
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
      questions = data;
      showQuestion();
    })
    .catch(err => {
      questionEl.innerText = "Failed to load exercises.";
      console.error(err);
    });

  function showQuestion() {
    // 🔴 DÜZELTME: tüm sorular bitince
    if (currentIndex >= questions.length) {
      questionEl.innerHTML = "🎉 All exercises completed!";
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
    questionEl.innerHTML = q.sentence.de;

    // Kullanıcı dilinde çeviri göster
    if (q.translation && q.translation[lang]) {
      questionEl.innerHTML += `<br><em style="color:#aaa; font-size:0.95rem;">${q.translation[lang]}</em>`;
    }

    // Seçenekler
    q.options[lang].forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.className = "option-btn";

      btn.addEventListener("click", () => handleAnswer(option, q, btn));

      optionsEl.appendChild(btn);
    });

    scoreEl.innerText = `Question ${currentIndex + 1} / ${questions.length} | Correct: ${correctCount}`;
  }

  function handleAnswer(selected, question, btn) {
    if (locked) return;
    locked = true;

    document.querySelectorAll("#options button").forEach(b => b.disabled = true);

    if (selected === question.answer[lang]) {
      btn.classList.add("option-correct");
      correctCount++;
      feedbackEl.innerHTML = `
        ✅ <strong>Correct</strong><br>
        <em>Explanation:</em> ${question.explanation[lang]}<br>
      `;
    } else {
      btn.classList.add("option-wrong");
      feedbackEl.innerHTML = `
        ❌ <strong>Incorrect</strong><br>
        <em>Explanation:</em> ${question.explanation[lang]}<br>
      `;
    }

    nextBtn.style.display = "inline-block";
  }

  // 🔴 DÜZELTME: artık başa dönmez
  nextBtn.addEventListener("click", () => {
    currentIndex++;
    showQuestion();
  });
});
