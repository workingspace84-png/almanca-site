from flask import Flask, render_template, jsonify, request
import os
import json

from webapp.config.home_structure.home_structure import HOME_STRUCTURE

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EXERCISES_FILE = os.path.join(BASE_DIR, 'data', 'exercises', 'exercises.json')


def load_exercises():
    """Load exercises JSON file safely"""
    try:
        with open(EXERCISES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading exercises: {e}")
        return []


# =========================
# Jinja2 Translate Filter
# =========================
TRANSLATIONS = {
    "Explanation": {"en": "Explanation", "tr": "Açıklama"},
    "Answer": {"en": "Answer", "tr": "Cevap"},
    "Next Question": {"en": "Next Question", "tr": "Sonraki Soru"}
}


@app.template_filter('translate')
def translate_filter(text, lang='en'):
    """Simple translation filter"""
    return TRANSLATIONS.get(text, {}).get(lang, text)


# =========================
# PAGE ROUTES
# =========================

@app.route("/")
def index():
    lang = request.args.get("lang", "en")
    return render_template(
        "index.html",
        HOME_STRUCTURE=HOME_STRUCTURE,
        lang=lang
    )


@app.route("/about")
def about():
    lang = request.args.get("lang", "en")
    return render_template("about.html", lang=lang)


@app.route("/unit/<unit_key>")
def unit_detail(unit_key):
    """Unit altındaki tüm egzersizleri gösterir"""
    lang = request.args.get("lang", "en")
    unit = None
    for section in HOME_STRUCTURE:
        for u in section["units"]:
            if u["unit_key"] == unit_key:
                unit = u
                break
    if not unit:
        return "Unit not found", 404
    return render_template("unit_detail.html", unit=unit, lang=lang)


@app.route("/exercise/<unit_key>/<exercise_key>")
def exercise_by_key(unit_key, exercise_key):
    """
    Tek egzersiz sayfası.
    exercise_id HOME_STRUCTURE üzerinden bulunur ve template'e gönderilir.
    """
    lang = request.args.get("lang", "en")

    # HOME_STRUCTURE üzerinden exercise_id bul
    found_exercise_id = None
    for section in HOME_STRUCTURE:
        for unit in section["units"]:
            if unit["unit_key"] == unit_key:
                for ex in unit.get("exercises", []):
                    if ex["exercise_key"] == exercise_key:
                        found_exercise_id = ex["exercise_id"]
                        break

    if found_exercise_id is None:
        return "Exercise not found", 404

    return render_template(
        "exercise.html",
        lang=lang,
        exercise_id=found_exercise_id  # ✅ JS için gerekli
    )


# =========================
# API ROUTES
# =========================

@app.route("/api/exercises", methods=["GET"])
def get_exercises():
    """Tüm egzersizleri JSON olarak döndürür"""
    return jsonify(load_exercises())


@app.route("/api/exercises/<int:exercise_id>", methods=["GET"])
def get_exercise_by_id(exercise_id):
    """Tek egzersizi JSON olarak döndürür"""
    exercises = load_exercises()
    exercise = next((ex for ex in exercises if ex["id"] == exercise_id), None)

    if not exercise:
        return jsonify({"error": "Exercise not found"}), 404

    return jsonify(exercise)


@app.route("/api/answer", methods=["POST"])
def check_answer():
    """Kullanıcının cevabını kontrol eder"""
    data = request.get_json()
    if not data or "id" not in data or "answer" not in data:
        return jsonify({"error": "Missing parameters"}), 400

    exercises = load_exercises()
    question = next((q for q in exercises if q["id"] == data["id"]), None)
    if not question:
        return jsonify({"error": "Question not found"}), 404

    lang = data.get("lang", "de")
    is_correct = data["answer"] == question["answer"].get(lang, "")
    return jsonify({
        "correct": is_correct,
        "explanation": question.get("explanation", {}).get(lang, "")
    })


if __name__ == "__main__":
    app.run(debug=True, port=5600)
