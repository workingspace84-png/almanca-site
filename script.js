const submitBtn = document.getElementById('submitBtn');

let currentQuestion = 0;
let score = 0;
let questions = [];

if (submitBtn) {

  fetch('praepositionen.json')
    .then(res => res.json())
    .then(data => {
      questions = data;
      showQuestion();
    });

  const input = document.getElementById('answerInput');
  const feedback = document.getElementById('feedback');

  function showQuestion() {
    const questionEl = document.getElementById('question');
    const scoreDiv = document.getElementById('score');

    if (currentQuestion < questions.length) {
      questionEl.innerText = questions[currentQuestion].sentence;
      input.value = '';
      feedback.innerText = '';
      scoreDiv.innerText = `Skor: ${score}/${questions.length}`;
      input.focus(); // Input her soru başında seçili olsun
    } else {
      questionEl.innerText = "Bitti 🎉";
      submitBtn.style.display = 'none';
    }
  }

  function submitAnswer() {
    if (!input.value.trim()) return;

    if (input.value.trim().toLowerCase() === questions[currentQuestion].answer.toLowerCase()) {
      score++;
      feedback.innerText = "Richtig! ✅";
    } else {
      feedback.innerText = "Falsch ❌";
    }

    currentQuestion++;
    setTimeout(showQuestion, 800);
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
