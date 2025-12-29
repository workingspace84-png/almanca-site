function checkAntwort(antwort) {
  const richtig = "der"; // doğru cevap
  const ergebnis = document.getElementById("ergebnis");
  if (antwort === richtig) {
    ergebnis.textContent = "Richtig!";
  } else {
    ergebnis.textContent = "Falsch!";
  }
}
