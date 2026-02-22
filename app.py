from flask import Flask, render_template, jsonify, request, send_from_directory, abort
from flask_compress import Compress
from flask_talisman import Talisman
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_wtf.csrf import CSRFProtect
import os
import json
import logging
import hashlib

from webapp.config.home_structure.home_structure import LEVEL_STRUCTURE, LEVELS_ORDER

app = Flask(__name__)

# =========================
# SECURITY CONFIG
# =========================

# Secret key (set a real one on Render as env variable SECRET_KEY)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-fallback-change-me')

# Supported languages whitelist
ALLOWED_LANGS = {'en', 'tr'}


def get_lang():
    """Get and validate the language parameter"""
    lang = request.args.get("lang", "en")
    return lang if lang in ALLOWED_LANGS else "en"


# Content Security Policy — allows self + Google Analytics
csp = {
    'default-src': "'self'",
    'script-src': [
        "'self'",
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        "'unsafe-inline'"
    ],
    'style-src': [
        "'self'",
        "'unsafe-inline'"
    ],
    'img-src': [
        "'self'",
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com',
        'data:'
    ],
    'connect-src': [
        "'self'",
        'https://www.google-analytics.com',
        'https://analytics.google.com',
        'https://www.googletagmanager.com'
    ],
    'font-src': "'self'",
    'frame-ancestors': "'none'"
}

# Flask-Talisman: security headers (CSP, HSTS, X-Frame, nosniff, etc.)
Talisman(
    app,
    content_security_policy=csp,
    force_https=False,  # Render handles HTTPS termination
    session_cookie_secure=True,
    session_cookie_http_only=True,
    session_cookie_samesite='Lax',
    referrer_policy='strict-origin-when-cross-origin'
)

# Flask-Limiter: rate limiting (uses client IP)
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["60 per minute"],
    storage_uri="memory://"
)

# CSRF protection for POST endpoints
csrf = CSRFProtect(app)


# Permissions-Policy: disable browser features we don't use
@app.after_request
def add_permissions_policy(response):
    response.headers['Permissions-Policy'] = (
        'camera=(), microphone=(), geolocation=(), payment=()'
    )
    return response

# Gzip compression — makes CSS/JS/JSON ~70% smaller
Compress(app)

# Cache static files for 1 year (they're versioned by content)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 31536000

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EXERCISES_FILE = os.path.join(BASE_DIR, 'data', 'exercises', 'exercises.json')

# =========================
# EXERCISE DATA (loaded once at startup)
# =========================
REQUIRED_FIELDS = ['id', 'level', 'exercise', 'sentence_de',
                   'option_1_en', 'option_1_tr', 'question_en', 'question_tr']


def _load_and_validate_exercises():
    """Load exercises from disk, validate required fields, cache in memory."""
    try:
        with open(EXERCISES_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        app.logger.error("exercises.json not found at %s", EXERCISES_FILE)
        return []
    except json.JSONDecodeError as e:
        app.logger.error("exercises.json is invalid JSON: %s", e)
        return []

    valid = []
    for i, q in enumerate(data):
        missing = [f for f in REQUIRED_FIELDS if f not in q]
        if missing:
            app.logger.warning("Exercise index %d (id=%s) missing fields: %s — skipped",
                               i, q.get('id', '?'), missing)
            continue
        valid.append(q)

    app.logger.info("Loaded %d exercises (%d skipped)", len(valid), len(data) - len(valid))
    return valid


EXERCISES_CACHE = _load_and_validate_exercises()


def load_exercises():
    """Return cached exercises list."""
    return EXERCISES_CACHE


# =========================
# STATIC ASSET CACHE BUSTING
# =========================
def _file_hash(filepath, length=8):
    """Generate a short hash from file contents for cache busting."""
    try:
        with open(os.path.join(BASE_DIR, 'static', filepath), 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()[:length]
    except Exception:
        return '0'


@app.context_processor
def asset_version():
    """Make asset_hash() available in all templates."""
    cache = {}
    def asset_hash(filepath):
        if filepath not in cache:
            cache[filepath] = _file_hash(filepath)
        return cache[filepath]
    return dict(asset_hash=asset_hash)


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
    lang = get_lang()
    return render_template(
        "index.html",
        LEVELS_ORDER=LEVELS_ORDER,
        LEVEL_STRUCTURE=LEVEL_STRUCTURE,
        lang=lang
    )


@app.route("/level/<level_key>")
def level_detail(level_key):
    """Display all exercises under a CEFR level"""
    lang = get_lang()
    level_key_upper = level_key.upper()
    level = LEVEL_STRUCTURE.get(level_key_upper)
    if not level:
        abort(404)
    return render_template("level_detail.html", level=level, lang=lang)


@app.route("/about")
def about():
    lang = get_lang()
    return render_template("about.html", lang=lang)



@app.route("/exercise/<level_key>/<exercise_key>")
def exercise_by_key(level_key, exercise_key):
    """Single exercise page"""
    lang = get_lang()

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
@limiter.limit("30 per minute")
def get_exercises():
    """Return all exercises as JSON"""
    return jsonify(load_exercises())


@app.route("/api/exercises/<int:exercise_id>", methods=["GET"])
@limiter.limit("30 per minute")
def get_exercise_by_id(exercise_id):
    """Return single exercise as JSON"""
    exercises = load_exercises()
    exercise = next((ex for ex in exercises if ex["id"] == exercise_id), None)

    if not exercise:
        return jsonify({"error": "Exercise not found"}), 404

    return jsonify(exercise)


@app.route("/api/exercises/<level_key>/<exercise_key>", methods=["GET"])
@limiter.limit("30 per minute")
def get_exercises_by_level_category(level_key, exercise_key):
    """Return all questions for a given level + exercise_key."""
    exercises = load_exercises()

    parts = exercise_key.split("_", 1)
    category = parts[1] if len(parts) == 2 else exercise_key
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
@limiter.limit("20 per minute")
def check_answer():
    """Check user's answer with input validation"""
    data = request.get_json()
    if not data or "id" not in data or "answer" not in data:
        return jsonify({"error": "Missing parameters"}), 400

    # Validate types
    if not isinstance(data["id"], int):
        return jsonify({"error": "Invalid id"}), 400
    if not isinstance(data["answer"], str) or len(data["answer"]) > 500:
        return jsonify({"error": "Invalid answer"}), 400

    # Validate lang
    lang = data.get("lang", "de")
    if lang not in ALLOWED_LANGS and lang != "de":
        lang = "de"

    exercises = load_exercises()
    question = next((q for q in exercises if q["id"] == data["id"]), None)
    if not question:
        return jsonify({"error": "Question not found"}), 404

    is_correct = data["answer"] == question["answer"].get(lang, "")
    return jsonify({
        "correct": is_correct,
        "explanation": question.get("explanation", {}).get(lang, "")
    })


@app.route("/api/i18n/<lang>.json")
def get_translations(lang):
    """Serve translation files from static/i18n/"""
    if lang not in ALLOWED_LANGS:
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


@app.route("/.well-known/security.txt")
def security_txt():
    return send_from_directory('static/.well-known', 'security.txt', mimetype='text/plain')


# =========================
# HEALTH CHECK
# =========================

@app.route("/health")
@limiter.exempt
def health():
    return jsonify({"status": "ok", "exercises": len(EXERCISES_CACHE)})


# =========================
# ERROR PAGES
# =========================

@app.errorhandler(404)
def page_not_found(e):
    lang = get_lang()
    return render_template("404.html", lang=lang), 404


@app.errorhandler(500)
def internal_error(e):
    lang = get_lang()
    return render_template("500.html", lang=lang), 500


@app.errorhandler(429)
def rate_limit_exceeded(e):
    return jsonify({"error": "Too many requests. Please slow down."}), 429


if __name__ == "__main__":
    app.run(debug=False, port=5600)
