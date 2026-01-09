const submitBtn = document.getElementById('submitBtn');
const input = document.getElementById('answerInput');
const feedback = document.getElementById('feedback');
const scoreDiv = document.getElementById('score');
const explanation = document.getElementById('explanation');

let currentQuestion = 0;
let score = 0;
let questions = [];

if (submitBtn) {

  // Almanca özel karakter paneli oluştur
  const charPanel = document.createElement('div');
  charPanel.id = 'char-panel';
  charPanel.style.marginBottom = '10px';
  charPanel.style.display = 'flex';
  charPanel.style.gap = '5px';

  const specialChars = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'];
  specialChars.forEach(char => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = char;
    btn.style.padding = '5px 10px';
    btn.style.borderRadius = '5px';
    btn.style.border = '1px solid #888';
    btn.style.background = '#f0f0f0';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => {
      input.value += char;
      input.focus();
    });
    charPanel.appendChild(btn);
  });

  // Input üstüne paneli ekle
  input.parentNode.insertBefore(charPanel, input);

  // Soruları JSON'dan çek
  fetch('praepositionen.json')
    .then(res => res.json())
    .then(data => {
      questions = data;
      showQuestion();
    });

  function showQuestion() {
    if (currentQuestion < questions.length) {
      const q = questions[currentQuestion];
      document.getElementById('question').innerHTML = `${q.sentence}<br><em>${q.translation}</em>`;
      input.value = '';
      feedback.innerText = '';
      explanation.innerText = q.explanation || '';
      scoreDiv.innerText = `Skor: ${score}/${questions.length}`;
      input.focus();
    } else {
      document.getElementById('question').innerText = "Bitti 🎉";
      submitBtn.style.display = 'none';
      charPanel.style.display = 'none';
    }
  }

  function submitAnswer() {
    if (!input.value.trim()) return;

    const correctAnswer = questions[currentQuestion].answer;

    if (input.value.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      feedback.innerText = "Richtig! ✅";
      score++;
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
