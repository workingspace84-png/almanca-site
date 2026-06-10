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

  // Extract level_key and exercise_key from EXERCISE_DATA URL for progress saving
  function getExerciseInfo() {
    try {
      const url = window.EXERCISE_DATA || "";
      const parts = url.split("/");
      // URL format: /api/exercises/A1/people-body-health
      const levelKey = parts[parts.length - 2];
      const exerciseKey = parts[parts.length - 1];
      return { levelKey, exerciseKey };
    } catch (e) {
      return null;
    }
  }

  function saveProgress(correct, total) {
    const info = getExerciseInfo();
    if (!info) return;
    const key = "progress_" + info.levelKey + "_" + info.exerciseKey;
    try {
      localStorage.setItem(key, JSON.stringify({ correct: correct, total: total }));
    } catch (e) {
      // localStorage unavailable, silently skip
    }
  }

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
    questionEl.textContent = window.I18N?.configError || "Exercise configuration error.";
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
        questionEl.textContent = window.I18N?.noExercises || "No exercises found.";
        return;
      }
      showQuestion();
    })
    .catch(err => {
      questionEl.textContent = window.I18N?.loadFailed || "Failed to load exercises.";
      console.error("Error loading exercises:", err);
    });

  function showQuestion() {
    if (currentIndex >= questions.length) {
      questionEl.textContent = window.I18N?.completedMessage || "\u{1F389} All exercises completed!";
      optionsEl.innerHTML = "";
      feedbackEl.textContent = "";
      nextBtn.style.display = "none";
      scoreEl.textContent = lang === "tr"
        ? `Do\u011fru cevaplar: ${correctCount} / ${questions.length}`
        : `Correct answers: ${correctCount} / ${questions.length}`;
      saveProgress(correctCount, questions.length);
      return;
    }

    locked = false;
    optionsEl.innerHTML = "";
    feedbackEl.textContent = "";
    nextBtn.style.display = "none";

    const q = questions[currentIndex];

    // Build question content safely using DOM elements
    questionEl.innerHTML = "";

    // German sentence (bold)
    const sentenceStrong = document.createElement("strong");
    sentenceStrong.textContent = q.sentence_de || "";
    questionEl.appendChild(sentenceStrong);

    // Translation in user's language
    const translationKey = `translation_${lang}`;
    if (q[translationKey]) {
      questionEl.appendChild(document.createElement("br"));
      const translationEm = document.createElement("em");
      translationEm.style.color = "#aaa";
      translationEm.style.fontSize = "0.9rem";
      translationEm.textContent = q[translationKey];
      questionEl.appendChild(translationEm);
    }

    // Actual question text
    const questionKey = `question_${lang}`;
    if (q[questionKey]) {
      questionEl.appendChild(document.createElement("br"));
      questionEl.appendChild(document.createElement("br"));
      const questionSpan = document.createElement("span");
      questionSpan.textContent = q[questionKey];
      questionEl.appendChild(questionSpan);
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
    scoreEl.textContent = lang === "tr"
      ? `Soru ${currentIndex + 1} / ${questions.length} | Do\u011fru: ${correctCount}`
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

    // Build feedback safely using DOM
    feedbackEl.innerHTML = "";

    if (isCorrect) {
      btn.classList.add("option-correct");
      correctCount++;

      const icon = document.createTextNode("\u2705 ");
      const label = document.createElement("strong");
      label.textContent = lang === "tr" ? "Do\u011fru" : "Correct";
      const br1 = document.createElement("br");
      const explLabel = document.createElement("em");
      explLabel.textContent = lang === "tr" ? "A\u00e7\u0131klama: " : "Explanation: ";
      const explText = document.createTextNode(explanation);

      feedbackEl.append(icon, label, br1, explLabel, explText);
    } else {
      btn.classList.add("option-wrong");
      const correctBtn = document.querySelector('#options button[data-correct="true"]');
      if (correctBtn) correctBtn.classList.add("option-correct");

      const icon = document.createTextNode("\u274C ");
      const label = document.createElement("strong");
      label.textContent = lang === "tr" ? "Yanl\u0131\u015f" : "Incorrect";
      const br1 = document.createElement("br");
      const ansLabel = document.createElement("em");
      ansLabel.textContent = lang === "tr" ? "Do\u011fru cevap: " : "Correct answer: ";
      const ansText = document.createTextNode(correctDisplay);
      const br2 = document.createElement("br");
      const explLabel = document.createElement("em");
      explLabel.textContent = lang === "tr" ? "A\u00e7\u0131klama: " : "Explanation: ";
      const explText = document.createTextNode(explanation);

      feedbackEl.append(icon, label, br1, ansLabel, ansText, br2, explLabel, explText);
    }

    // Show next button
    nextBtn.textContent = window.I18N?.nextButton || "Next Question";
    nextBtn.style.display = "inline-block";
  }

  nextBtn.addEventListener("click", () => {
    currentIndex++;
    showQuestion();
  });
});
