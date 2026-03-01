from flask import Flask, render_template, jsonify, request, send_from_directory, abort, Response
from flask_compress import Compress
from flask_talisman import Talisman
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_wtf.csrf import CSRFProtect
import os
import json
import logging
import hashlib
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

from webapp.config.home_structure.home_structure import LEVEL_STRUCTURE, LEVELS_ORDER

app = Flask(__name__)

# =========================
# LOGGING CONFIG
# =========================
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

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
        "'unsafe-inline'",
        'https://fonts.googleapis.com'
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
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
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
    seen_ids = set()
    for i, q in enumerate(data):
        missing = [f for f in REQUIRED_FIELDS if f not in q]
        if missing:
            app.logger.warning("Exercise index %d (id=%s) missing fields: %s — skipped",
                               i, q.get('id', '?'), missing)
            continue
        qid = q['id']
        if qid in seen_ids:
            app.logger.warning("Duplicate exercise id=%s at index %d — skipped", qid, i)
            continue
        seen_ids.add(qid)
        valid.append(q)

    app.logger.info("Loaded %d exercises (%d skipped)", len(valid), len(data) - len(valid))
    return valid


EXERCISES_CACHE = _load_and_validate_exercises()
EXERCISES_ETAG = hashlib.md5(json.dumps(EXERCISES_CACHE, sort_keys=True).encode()).hexdigest()


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
def template_globals():
    """Make asset_hash() and now() available in all templates."""
    hash_cache = {}
    def asset_hash(filepath):
        if filepath not in hash_cache:
            hash_cache[filepath] = _file_hash(filepath)
        return hash_cache[filepath]
    return dict(asset_hash=asset_hash, now=datetime.utcnow)


# =========================
# Jinja2 Translate Filter
# =========================
TRANSLATIONS = {
    "Explanation": {"en": "Explanation", "tr": "Açıklama"},
    "Answer": {"en": "Answer", "tr": "Cevap"},
    "Next Question": {"en": "Next Question", "tr": "Sonraki Soru"},
    "All exercises completed!": {"en": "All exercises completed!", "tr": "Tüm alıştırmalar tamamlandı!"},
    "Exercise configuration error.": {"en": "Exercise configuration error.", "tr": "Alıştırma yapılandırma hatası."},
    "No exercises found.": {"en": "No exercises found.", "tr": "Alıştırma bulunamadı."},
    "Failed to load exercises.": {"en": "Failed to load exercises.", "tr": "Alıştırmalar yüklenemedi."}
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


@app.route("/api/exercises/<level_key>/<exercise_key>", methods=["GET"])
@limiter.limit("30 per minute")
def get_exercises_by_level_category(level_key, exercise_key):
    """Return all questions for a given level + exercise_key."""
    # ETag: let browser skip re-downloading unchanged data
    if request.headers.get('If-None-Match') == EXERCISES_ETAG:
        return Response(status=304)

    exercises = load_exercises()

    filtered = [
        ex for ex in exercises
        if ex.get("level", "").upper() == level_key.upper()
        and ex.get("exercise", "") == exercise_key
    ]

    if not filtered:
        return jsonify({"error": "No exercises found"}), 404

    response = jsonify(filtered)
    response.headers['ETag'] = EXERCISES_ETAG
    return response



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
    base = 'https://www.intuitvegerman.com'
    urls = [
        {'loc': f'{base}/', 'priority': '1.0', 'freq': 'weekly'},
        {'loc': f'{base}/about', 'priority': '0.6', 'freq': 'monthly'},
    ]
    for level_key in LEVELS_ORDER:
        urls.append({'loc': f'{base}/level/{level_key}', 'priority': '0.9', 'freq': 'weekly'})
        for ex in LEVEL_STRUCTURE[level_key]['exercises']:
            urls.append({
                'loc': f'{base}/exercise/{level_key}/{ex["exercise_key"]}',
                'priority': '0.8', 'freq': 'weekly'
            })
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for u in urls:
        xml += f'  <url><loc>{u["loc"]}</loc><changefreq>{u["freq"]}</changefreq><priority>{u["priority"]}</priority></url>\n'
    xml += '</urlset>'
    return Response(xml, mimetype='application/xml')


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
