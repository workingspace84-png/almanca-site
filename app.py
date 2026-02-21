from flask import Flask, render_template, jsonify, request, send_from_directory, abort
from flask_compress import Compress
import os
import json

from webapp.config.home_structure.home_structure import LEVEL_STRUCTURE, LEVELS_ORDER

app = Flask(__name__)

# Gzip compression — makes CSS/JS/JSON ~70% smaller
Compress(app)

# Cache static files for 1 year (they're versioned by content)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 31536000

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
        LEVELS_ORDER=LEVELS_ORDER,
        lang=lang
    )


@app.route("/level/<level_key>")
def level_detail(level_key):
    """Display all exercises under a CEFR level"""
    lang = request.args.get("lang", "en")
    level_key_upper = level_key.upper()
    level = LEVEL_STRUCTURE.get(level_key_upper)
    if not level:
        abort(404)
    return render_template("level_detail.html", level=level, lang=lang)


@app.route("/about")
def about():
    lang = request.args.get("lang", "en")
    return render_template("about.html", lang=lang)



@app.route("/exercise/<level_key>/<exercise_key>")
def exercise_by_key(level_key, exercise_key):
    """Single exercise page"""
    lang = request.args.get("lang", "en")

    level_key_upper = level_key.upper()
    level_data = LEVEL_STRUCTURE.get(level_key_upper)
    if not level_data:
        abort(404)

    found_exercise = next(
        (ex for ex in level_data.get("exercises", []) if ex["exercise_key"] == exercise_key),
        None
    )
    if not found_exercise:
        abort(404)

    exercise_title = found_exercise.get("title", {})
    if isinstance(exercise_title, dict):
        exercise_title = exercise_title.get(lang, exercise_key)

    return render_template(
        "exercise.html",
        lang=lang,
        level_key=level_key_upper,
        exercise_key=exercise_key,
        exercise_title=exercise_title
    )


# =========================
# API ROUTES
# =========================

@app.route("/api/exercises", methods=["GET"])
def get_exercises():
    """Return all exercises as JSON"""
    return jsonify(load_exercises())


@app.route("/api/exercises/<int:exercise_id>", methods=["GET"])
def get_exercise_by_id(exercise_id):
    """Return single exercise as JSON"""
    exercises = load_exercises()
    exercise = next((ex for ex in exercises if ex["id"] == exercise_id), None)

    if not exercise:
        return jsonify({"error": "Exercise not found"}), 404

    return jsonify(exercise)


@app.route("/api/exercises/<level_key>/<exercise_key>", methods=["GET"])
def get_exercises_by_level_category(level_key, exercise_key):
    """Return all questions for a given level + exercise_key.
    exercise_key (e.g. a1_ex_1) maps to category (e.g. exercise_1) in the JSON.
    The category value is everything after the first underscore-separated level prefix,
    e.g. a1_ex_1 -> ex_1, but we store it as exercise_1, so we strip the level prefix.
    Simpler: category in JSON IS exercise_key with the leading level tag removed.
    Convention: a1_ex_1 -> category = exercise_1 (drop 'a1_' prefix).
    """
    exercises = load_exercises()

    # Derive category from exercise_key: "a1_ex_1" -> "exercise_1"
    # Strip leading level prefix (everything up to and including the first '_')
    parts = exercise_key.split("_", 1)
    category = parts[1] if len(parts) == 2 else exercise_key  # "ex_1"
    # Normalise: "ex_1" -> "exercise_1"
    category = category.replace("ex_", "exercise_")

    filtered = [
        ex for ex in exercises
        if ex.get("level", "").upper() == level_key.upper()
        and ex.get("exercise", "") == category
    ]

    if not filtered:
        return jsonify({"error": "No exercises found"}), 404

    return jsonify(filtered)


@app.route("/api/answer", methods=["POST"])
def check_answer():
    """Check user's answer"""
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


@app.route("/api/i18n/<lang>.json")
def get_translations(lang):
    """Serve translation files from static/i18n/"""
    if lang not in ['en', 'tr']:
        return jsonify({"error": "Language not supported"}), 404
    return send_from_directory('static/i18n', f'{lang}.json')


# =========================
# SEO: robots.txt & sitemap
# =========================

@app.route("/robots.txt")
def robots():
    return send_from_directory('static', 'robots.txt', mimetype='text/plain')


@app.route("/sitemap.xml")
def sitemap():
    return send_from_directory('static', 'sitemap.xml', mimetype='application/xml')


# =========================
# ERROR PAGES
# =========================

@app.errorhandler(404)
def page_not_found(e):
    lang = request.args.get("lang", "en")
    return render_template("404.html", lang=lang), 404


@app.errorhandler(500)
def internal_error(e):
    lang = request.args.get("lang", "en")
    return render_template("500.html", lang=lang), 500


if __name__ == "__main__":
    app.run(debug=False, port=5600)