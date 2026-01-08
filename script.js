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

  function showQuestion() {
    const questionEl = document.getElementById('question');
    const input = document.getElementById('answerInput');
    const feedback = document.getElementById('feedback');
    const scoreDiv = document.getElementById('score');

    if (currentQuestion < questions.length) {
      questionEl.innerText = questions[currentQuestion].sentence;
      input.value = '';
      feedback.innerText = '';
      scoreDiv.innerText = `Skor: ${score}/${questions.length}`;
    } else {
      questionEl.innerText = "Bitti 🎉";
      submitBtn.style.display = 'none';
    }
  }

  submitBtn.addEventListener('click', () => {
    const input = document.getElementById('answerInput');
    const feedback = document.getElementById('feedback');

    if (input.value.trim().toLowerCase() === questions[currentQuestion].answer.toLowerCase()) {
      score++;
      feedback.innerText = "Richtig!";
    } else {
      feedback.innerText = "Falsch!";
    }

    currentQuestion++;
    setTimeout(showQuestion, 800);
  });

}
