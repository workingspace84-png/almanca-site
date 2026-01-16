from flask import Flask, render_template, jsonify, request
import os
import json

from webapp.config.home_structure.home_structure import HOME_STRUCTURE

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EXERCISES_FILE = os.path.join(BASE_DIR, 'data', 'exercises', 'exercises.json')


def load_exercises():
    try:
        with open(EXERCISES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading exercises: {e}")
        return []


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


@app.route("/exercise")
def exercise():
    lang = request.args.get("lang", "en")
    exercises = load_exercises()
    return render_template(
        "exercise.html",
        exercises=exercises,
        lang=lang
    )


@app.route("/about")
def about():
    lang = request.args.get("lang", "en")
    return render_template("about.html", lang=lang)


# =========================
# API ROUTES
# =========================

@app.route("/api/exercises", methods=["GET"])
def get_exercises():
    return jsonify(load_exercises())


@app.route("/api/answer", methods=["POST"])
def check_answer():
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
