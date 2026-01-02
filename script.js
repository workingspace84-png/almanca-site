let currentQuestion = 0;
let score = 0;
let questions = [];

// JSON'dan soruları çek
fetch('../data/praepositionen.json')
  .then(res => res.json())
  .then(data => {
    questions = data;
    showQuestion();
  });

// Soruyu göster
function showQuestion() {
  if(currentQuestion < questions.length) {
    // Soru metnini yerleştir
    document.querySelector('.question-container p').innerHTML = questions[currentQuestion].sentence;

    // Input temizle
    const input = document.getElementById('answer');
    input.value = '';

    // Feedback div'i kontrol et, yoksa ekle
    if(!document.getElementById('feedback')) {
      const feedbackDiv = document.createElement('div');
      feedbackDiv.id = 'feedback';
      feedbackDiv.style.marginTop = '10px';
      feedbackDiv.style.fontWeight = 'bold';
      input.parentNode.appendChild(feedbackDiv);
    } else {
      document.getElementById('feedback').innerText = '';
    }

    // Skor alanı varsa sıfırla
    const scoreDiv = document.getElementById('score');
    if(scoreDiv) scoreDiv.innerText = `Skor: ${score}/${questions.length}`;

  } else {
    document.querySelector('.question-container p').innerText = "Tebrikler! Alıştırma tamamlandı.";
    document.getElementById('answer').style.display = 'none';
    document.getElementById('submit-button').style.display = 'none';
    if(document.getElementById('feedback')) {
      document.getElementById('feedback').innerText = `Skorunuz: ${score}/${questions.length}`;
    }
  }
}

// Submit butonuna tıklandığında
document.getElementById('submit-button').addEventListener('click', () => {
  const input = document.getElementById('answer');
  const userAnswer = input.value.trim().toLowerCase();
  const correctAnswer = questions[currentQuestion].answer.toLowerCase();
  const feedback = document.getElementById('feedback');

  if(userAnswer === correctAnswer) {
    feedback.innerText = "Richtig! 🎉";
    feedback.style.color = "green";
    score++;
  } else {
    feedback.innerText = `Falsch! İpucu: ${questions[currentQuestion].hint}`;
    feedback.style.color = "red";
  }

  currentQuestion++;
  setTimeout(showQuestion, 1000);

  const scoreDiv = document.getElementById('score');
  if(scoreDiv) scoreDiv.innerText = `Skor: ${score}/${questions.length}`;
});
