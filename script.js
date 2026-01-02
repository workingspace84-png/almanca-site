let currentQuestion = 0;
let score = 0;
let questions = [];

fetch('../data/praepositionen.json')
  .then(res => res.json())
  .then(data => {
    questions = data;
    showQuestion();
  });

function showQuestion() {
  if(currentQuestion < questions.length) {
    document.getElementById("question").innerText = questions[currentQuestion].sentence;
    document.getElementById("answerInput").value = '';
    document.getElementById("feedback").innerText = '';
  } else {
    document.getElementById("question").innerText = "Tebrikler! Alıştırma tamamlandı.";
    document.getElementById("answerInput").style.display = 'none';
    document.getElementById("submitBtn").style.display = 'none';
    document.getElementById("feedback").innerText = `Skorunuz: ${score}/${questions.length}`;
  }
}

document.getElementById("submitBtn").addEventListener("click", () => {
  const userAnswer = document.getElementById("answerInput").value.trim().toLowerCase();
  const correctAnswer = questions[currentQuestion].answer.toLowerCase();
  const feedback = document.getElementById("feedback");

  if(userAnswer === correctAnswer) {
    feedback.innerText = "Doğru! 🎉";
    feedback.style.color = "green";
    score++;
  } else {
    feedback.innerText = `Yanlış! İpucu: ${questions[currentQuestion].hint}`;
    feedback.style.color = "red";
  }

  currentQuestion++;
  setTimeout(showQuestion, 1000);
  document.getElementById("score").innerText = `Skor: ${score}/${questions.length}`;
});
