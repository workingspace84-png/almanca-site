# Intuitive German Institute – Technical Summary

## What Is This Project?
An academic German grammar learning website. Bilingual (English + Turkish). Dark theme. Users pick a CEFR level (A1–C2), choose an exercise, and answer grammar questions about German sentences.

---

## Tech Stack
- **Backend:** Python Flask 3.0.0 + Gunicorn (production server)
- **Frontend:** Vanilla HTML/CSS/JS (no frameworks)
- **Templating:** Jinja2 (Flask built-in)
- **Compression:** flask-compress (Gzip)
- **Data:** Single JSON file (no database)
- **Languages:** English (en) + Turkish (tr), switchable via `?lang=` URL param

---

## File Structure

```
almanca-site-main/
├── app.py                          # Main Flask app — all routes, API, error handlers
├── requirements.txt                # Flask, gunicorn, flask-compress
├── data/exercises/
│   └── exercises.json              # ALL exercise questions (single file)
├── static/
│   ├── css/
│   │   ├── base.css                # Root variables, global styles, dark theme, accessibility
│   │   ├── header.css              # Header + language switcher
│   │   ├── footer.css              # Footer with responsive breakpoints
│   │   ├── home.css                # Homepage level cards (A1–C2 list)
│   │   ├── unit_detail.css         # Level detail page (exercise list)
│   │   ├── exercise.css            # Exercise page (question + options)
│   │   └── about.css               # About page
│   ├── js/
│   │   ├── header.js               # Language switching, localStorage, URL param handling
│   │   └── exercises.js            # Exercise engine: fetch, shuffle, answer check, score
│   ├── i18n/
│   │   ├── en.json                 # UI string translations (English)
│   │   └── tr.json                 # UI string translations (Turkish)
│   ├── favicon.svg                 # "IG" logo, dark theme colors
│   ├── robots.txt                  # SEO — allows all crawlers
│   └── sitemap.xml                 # SEO — lists all level pages (UPDATE DOMAIN before publish)
├── templates/
│   ├── base.html                   # Master template — meta, SEO, hreflang, analytics placeholder
│   ├── header.html                 # Site header with nav links + EN/TR switcher
│   ├── footer.html                 # Simple copyright footer
│   ├── index.html                  # Homepage — level card list
│   ├── level_detail.html           # Level page — shows exercises under a level
│   ├── exercise.html               # Exercise page — loads exercises.js
│   ├── about.html                  # About page (bilingual)
│   ├── 404.html                    # Styled "not found" error (bilingual)
│   └── 500.html                    # Styled "server error" (bilingual)
└── webapp/config/home_structure/
    └── home_structure.py           # LEVEL_STRUCTURE dict — defines levels + exercise keys
```

---

## How Routing Works

### Page Routes (return HTML)
| URL | Template | What it shows |
|-----|----------|---------------|
| `/` | index.html | Level cards (A1–C2) |
| `/level/<level_key>` | level_detail.html | Exercise list for that level |
| `/exercise/<level_key>/<exercise_key>` | exercise.html | Single exercise with questions |
| `/about` | about.html | About page |

### API Routes (return JSON)
| URL | What it returns |
|-----|-----------------|
| `GET /api/exercises` | All exercises |
| `GET /api/exercises/<id>` | Single exercise by ID |
| `GET /api/exercises/<level>/<exercise_key>` | Filtered questions for one exercise |
| `POST /api/answer` | Check answer (legacy, not used by frontend) |
| `GET /api/i18n/<lang>.json` | Translation strings |

---

## exercises.json Structure
Each question object:
```json
{
  "id": 3,
  "level": "A1",
  "exercise": "exercise_1",        ← used for API filtering
  "category": "People&Body",       ← topic label (not used for routing)
  "sentence_de": "German sentence",
  "translation_en": "...",
  "translation_tr": "...",
  "question_en": "The question in English",
  "question_tr": "The question in Turkish",
  "option_1_en": "CORRECT answer EN",    ← option_1 is ALWAYS correct
  "option_2_en": "Wrong answer EN",
  "option_1_tr": "CORRECT answer TR",
  "option_2_tr": "Wrong answer TR",
  "correct_answer_en": "...",      ← used for display when user picks wrong
  "correct_answer_tr": "...",
  "explanation_en": "...",
  "explanation_tr": "..."
}
```
**Key rule:** `option_1` is always the correct answer. The JS shuffles display order.

---

## Exercise Key Mapping
- home_structure.py defines: `"exercise_key": "a1_ex_1"`
- URL becomes: `/exercise/A1/a1_ex_1`
- API call: `/api/exercises/A1/a1_ex_1`
- app.py converts: `a1_ex_1` → strips `a1_` → `ex_1` → replaces `ex_` with `exercise_` → `exercise_1`
- Filters JSON where `level == "A1"` AND `exercise == "exercise_1"`

---

## Language System
- URL param `?lang=en` or `?lang=tr` (default: en)
- `header.js` saves choice in localStorage, adds `?lang=` to all internal links
- CSS classes `.lang-en` / `.lang-tr` — all hidden by default, JS shows the active one
- Jinja2 filter `translate()` for server-side strings (only 3 strings)
- `exercises.js` uses `window.LANGUAGE` to pick `_en` or `_tr` suffixed fields
- `<html lang="{{ lang }}">` is set dynamically

---

## CSS Architecture
- Dark theme via CSS custom properties in `:root` (base.css)
- Key colors: bg `#121212`, text `#eee`, cards `#1e1e2f`, borders `#333`
- Font: Inter (Google Fonts)
- 3 responsive breakpoints: 768px (tablet), 600px (exercise only), 480px (phone)
- Accessibility: `.sr-only` class for screen readers, focus-visible states

---

## Performance Features
- Gzip compression (flask-compress)
- Static file caching: 1 year (`SEND_FILE_MAX_AGE_DEFAULT`)
- All JS loaded with `defer`
- No frameworks, no build tools — total CSS ~15KB, total JS ~5KB
- SVG favicon (smallest possible)

---

## Production Setup
- `debug=False` in app.py
- Use Gunicorn: `gunicorn app:app -b 0.0.0.0:5600`
- Google Analytics placeholder in base.html (commented out — uncomment + add ID)
- robots.txt + sitemap.xml ready (UPDATE DOMAIN in both files before publish)
- HTTPS: configure via hosting provider

---

## Current State (as of Feb 2026)
- Levels A1–C2 structure defined (10 exercises each)
- exercises.json has questions for A1 exercise_1 through exercise_4 (content still being created)
- Exercise engine fully working: shuffle, bilingual feedback, score tracking
- All error pages styled and bilingual
- No database — everything reads from exercises.json
- No user accounts / login system
- No answer tracking/analytics yet (can be added later)
