document.addEventListener("DOMContentLoaded", () => {
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const feedbackEl = document.getElementById("feedback");
  const scoreEl = document.getElementById("score");
  const nextBtn = document.getElementById("nextBtn");

  const lang = window.LANGUAGE || "en";
  let questions = [];
  let currentIndex = 0;
  let correctCount = 0;
  let locked = false;

  // Fisher-Yates shuffle
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Check if EXERCISE_DATA is defined
  if (!window.EXERCISE_DATA) {
    console.error("EXERCISE_DATA is not defined");
    questionEl.innerText = "Exercise configuration error.";
    return;
  }

  fetch(window.EXERCISE_DATA)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      questions = Array.isArray(data) ? data : [data];
      if (questions.length === 0) {
        questionEl.innerText = "No exercises found.";
        return;
      }
      showQuestion();
    })
    .catch(err => {
      questionEl.innerText = "Failed to load exercises.";
      console.error("Error loading exercises:", err);
    });

  function showQuestion() {
    if (currentIndex >= questions.length) {
      questionEl.innerHTML = window.I18N?.completedMessage || "🎉 All exercises completed!";
      optionsEl.innerHTML = "";
      feedbackEl.innerHTML = "";
      nextBtn.style.display = "none";
      scoreEl.innerText = lang === "tr"
        ? `Doğru cevaplar: ${correctCount} / ${questions.length}`
        : `Correct answers: ${correctCount} / ${questions.length}`;
      return;
    }

    locked = false;
    optionsEl.innerHTML = "";
    feedbackEl.innerHTML = "";
    nextBtn.style.display = "none";

    const q = questions[currentIndex];

    // Display German sentence
    questionEl.innerHTML = `<strong>${q.sentence_de || ""}</strong>`;

    // Display translation in user's language
    const translationKey = `translation_${lang}`;
    if (q[translationKey]) {
      questionEl.innerHTML += `<br><em style="color:#aaa; font-size:0.9rem;">${q[translationKey]}</em>`;
    }

    // Display the actual question text
    const questionKey = `question_${lang}`;
    if (q[questionKey]) {
      questionEl.innerHTML += `<br><br>${q[questionKey]}`;
    }

    // Build options list from the question data
    // option_1 is always the correct answer
    const optionsList = [];
    for (let i = 1; i <= 3; i++) {
      const optionKey = `option_${i}_${lang}`;
      if (q[optionKey]) {
        optionsList.push({ text: q[optionKey], isCorrect: i === 1 });
      }
    }

    // Shuffle so the correct answer isn't always first
    shuffleArray(optionsList);

    // Create option buttons
    optionsList.forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = option.text;
      btn.className = "option-btn";
      if (option.isCorrect) btn.dataset.correct = "true";
      btn.addEventListener("click", () => handleAnswer(option.isCorrect, q, btn));
      optionsEl.appendChild(btn);
    });

    // Progress indicator
    scoreEl.innerText = lang === "tr"
      ? `Soru ${currentIndex + 1} / ${questions.length} | Doğru: ${correctCount}`
      : `Question ${currentIndex + 1} / ${questions.length} | Correct: ${correctCount}`;
  }

  function handleAnswer(isCorrect, question, btn) {
    if (locked) return;
    locked = true;

    // Disable all option buttons
    document.querySelectorAll("#options button").forEach(b => b.disabled = true);

    // Use correct_answer field for display; fall back to option_1 if missing
    const correctDisplay = question[`correct_answer_${lang}`]
      || question[`option_1_${lang}`]
      || "";

    // Get explanation for current language
    const explanation = question[`explanation_${lang}`] || "";

    if (isCorrect) {
      btn.classList.add("option-correct");
      correctCount++;
      feedbackEl.innerHTML = `
        ✅ <strong>${lang === "tr" ? "Doğru" : "Correct"}</strong><br>
        <em>${lang === "tr" ? "Açıklama:" : "Explanation:"}</em> ${explanation}<br>
      `;
    } else {
      btn.classList.add("option-wrong");
      // Highlight the correct option button in green
      const correctBtn = document.querySelector('#options button[data-correct="true"]');
      if (correctBtn) correctBtn.classList.add("option-correct");
      feedbackEl.innerHTML = `
        ❌ <strong>${lang === "tr" ? "Yanlış" : "Incorrect"}</strong><br>
        <em>${lang === "tr" ? "Doğru cevap:" : "Correct answer:"}</em> ${correctDisplay}<br>
        <em>${lang === "tr" ? "Açıklama:" : "Explanation:"}</em> ${explanation}<br>
      `;
    }

    // Show next button
    nextBtn.innerText = window.I18N?.nextButton || "Next Question";
    nextBtn.style.display = "inline-block";
  }

  nextBtn.addEventListener("click", () => {
    currentIndex++;
    showQuestion();
  });
});
