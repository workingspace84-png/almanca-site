from flask import Flask, jsonify, request, render_template
import json, os

app = Flask(__name__)

# JSON sorularının yolu
EXERCISES_FILE = os.path.join(os.path.dirname(__file__), 'exercises', 'exercise-multi.json')

def load_exercises():
    """JSON sorularını güvenli şekilde oku"""
    try:
        with open(EXERCISES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Hata: {e}")
        return []

# Dinamik sayfa yönlendirme
@app.route('/')
def index():
    """Ana sayfa varsayılan olarak index.html açsın"""
    return render_template('index.html')

@app.route('/<page>')
def render_page(page):
    """
    Dinamik sayfa yönlendirme.
    Örnek: /hakkinda -> templates/hakkinda.html
            /exercise-multi -> templates/exercise-multi.html
    """
    try:
        return render_template(f"{page}.html")
    except:
        return "Sayfa bulunamadı", 404

# API: Tüm sorular
@app.route('/api/exercises', methods=['GET'])
def get_exercises():
    return jsonify(load_exercises())

# API: Cevap kontrolü
@app.route('/api/answer', methods=['POST'])
def check_answer():
    """
    POST body: { "id": 1, "answer": "cevap metni" }
    """
    data = request.get_json()
    if not data or 'id' not in data or 'answer' not in data:
        return jsonify({"error": "Eksik parametre"}), 400

    exercises = load_exercises()
    question = next((q for q in exercises if q['id'] == data['id']), None)
    if not question:
        return jsonify({"error": "Soru bulunamadı"}), 404

    # Almanca cevaba göre kontrol
    is_correct = data['answer'] == question['answer']['de']
    return jsonify({"correct": is_correct})

# Flask uygulamasını başlat
if __name__ == '__main__':
    app.run(debug=True, port=5600)
