# LEVEL_STRUCTURE defines the content for each CEFR level page.
# Each level has a list of exercises organized by topic with clean URL slugs.

LEVEL_STRUCTURE = {
    "A1": {
        "level": "A1",
        "description": {
            "en": "Beginner level – foundational German grammar exercises.",
            "tr": "Başlangıç seviyesi – temel Almanca dilbilgisi alıştırmaları."
        },
        "exercises": [
            {"exercise_key": "people-body-health",    "title": {"en": "People, Body & Health",    "tr": "İnsanlar, Vücut ve Sağlık"}},
            {"exercise_key": "communication",          "title": {"en": "Communication",             "tr": "İletişim"}},
            {"exercise_key": "home-everyday-life",     "title": {"en": "Home & Everyday Life",      "tr": "Ev ve Günlük Yaşam"}},
            {"exercise_key": "work",                   "title": {"en": "Work",                      "tr": "İş"}},
            {"exercise_key": "public-life",            "title": {"en": "Public Life",                "tr": "Kamusal Yaşam"}},
            {"exercise_key": "eating-drinking",        "title": {"en": "Eating & Drinking",          "tr": "Yeme ve İçme"}},
            {"exercise_key": "nature-environment",     "title": {"en": "Nature & Environment",       "tr": "Doğa ve Çevre"}},
            {"exercise_key": "time",                   "title": {"en": "Time",                      "tr": "Zaman"}},
        ]
    },
    "A2": {
        "level": "A2",
        "description": {
            "en": "Elementary level – building on the basics of German grammar.",
            "tr": "Temel seviye – Almanca dilbilgisinin temellerini pekiştirin."
        },
        "exercises": [
            {"exercise_key": "body-feelings-health",       "title": {"en": "Body, Feelings & Health",       "tr": "Vücut, Duygular ve Sağlık"}},
            {"exercise_key": "communication-media",        "title": {"en": "Communication & Media",         "tr": "İletişim ve Medya"}},
            {"exercise_key": "housing-daily-routines",     "title": {"en": "Housing & Daily Routines",      "tr": "Konut ve Günlük Rutinler"}},
            {"exercise_key": "work-career",                "title": {"en": "Work & Career",                 "tr": "İş ve Kariyer"}},
            {"exercise_key": "public-life-city-services",  "title": {"en": "Public Life & City Services",   "tr": "Kamusal Yaşam ve Şehir Hizmetleri"}},
            {"exercise_key": "food-drinks-shopping",       "title": {"en": "Food, Drinks & Shopping",       "tr": "Yiyecek, İçecek ve Alışveriş"}},
            {"exercise_key": "nature-weather-environment", "title": {"en": "Nature, Weather & Environment", "tr": "Doğa, Hava Durumu ve Çevre"}},
            {"exercise_key": "time-dates-planning",        "title": {"en": "Time, Dates & Planning",        "tr": "Zaman, Tarihler ve Planlama"}},
            {"exercise_key": "family-friends-social",      "title": {"en": "Family, Friends & Social Life", "tr": "Aile, Arkadaşlar ve Sosyal Yaşam"}},
            {"exercise_key": "leisure-hobbies-culture",    "title": {"en": "Leisure, Hobbies & Culture",    "tr": "Boş Zaman, Hobiler ve Kültür"}},
            {"exercise_key": "travel-transport",           "title": {"en": "Travel & Transport",            "tr": "Seyahat ve Ulaşım"}},
            {"exercise_key": "clothes-fashion",            "title": {"en": "Clothes & Fashion",             "tr": "Giyim ve Moda"}},
            {"exercise_key": "school-education",           "title": {"en": "School & Education",            "tr": "Okul ve Eğitim"}},
            {"exercise_key": "money-finances",             "title": {"en": "Money & Finances",              "tr": "Para ve Finans"}},
            {"exercise_key": "technology-digital",         "title": {"en": "Technology & Digital Life",     "tr": "Teknoloji ve Dijital Yaşam"}},
            {"exercise_key": "personal-care-appearance",   "title": {"en": "Personal Care & Appearance",   "tr": "Kişisel Bakım ve Görünüm"}},
        ]
    },
    "B1": {
        "level": "B1",
        "description": {
            "en": "Intermediate level – more complex German structures.",
            "tr": "Orta seviye – daha karmaşık Almanca yapılar."
        },
        "exercises": [
            {"exercise_key": "body-health-medical",              "title": {"en": "Body, Health & Medical Care",                    "tr": "Vücut, Sağlık ve Tıbbi Bakım"}},
            {"exercise_key": "emotions-character-relationships",  "title": {"en": "Emotions, Character & Relationships",           "tr": "Duygular, Karakter ve İlişkiler"}},
            {"exercise_key": "communication-opinions",            "title": {"en": "Communication & Expressing Opinions",           "tr": "İletişim ve Görüş Bildirme"}},
            {"exercise_key": "housing-neighbourhood-city",        "title": {"en": "Housing, Neighbourhood & City Life",            "tr": "Konut, Mahalle ve Şehir Yaşamı"}},
            {"exercise_key": "work-career-professional",          "title": {"en": "Work, Career & Professional Life",              "tr": "İş, Kariyer ve Profesyonel Yaşam"}},
            {"exercise_key": "education-learning-training",       "title": {"en": "Education, Learning & Training",                "tr": "Eğitim, Öğrenme ve Gelişim"}},
            {"exercise_key": "public-life-law-authorities",       "title": {"en": "Public Life, Law & Authorities",                "tr": "Kamusal Yaşam, Hukuk ve Otoriteler"}},
            {"exercise_key": "food-cooking-nutrition",            "title": {"en": "Food, Cooking & Nutrition",                     "tr": "Yemek, Yemek Pişirme ve Beslenme"}},
            {"exercise_key": "shopping-money-consumer",           "title": {"en": "Shopping, Money & Consumer Life",               "tr": "Alışveriş, Para ve Tüketici Yaşamı"}},
            {"exercise_key": "nature-environment-sustainability", "title": {"en": "Nature, Environment & Sustainability",          "tr": "Doğa, Çevre ve Sürdürülebilirlik"}},
            {"exercise_key": "travel-tourism-intercultural",      "title": {"en": "Travel, Tourism & Intercultural Experience",    "tr": "Seyahat, Turizm ve Kültürlerarası Deneyim"}},
            {"exercise_key": "transport-mobility",                "title": {"en": "Transport & Mobility",                          "tr": "Ulaşım ve Hareketlilik"}},
            {"exercise_key": "leisure-sports-wellbeing",          "title": {"en": "Leisure, Sports & Wellbeing",                   "tr": "Boş Zaman, Spor ve İyi Oluş"}},
            {"exercise_key": "culture-arts-entertainment",        "title": {"en": "Culture, Arts & Entertainment",                 "tr": "Kültür, Sanat ve Eğlence"}},
            {"exercise_key": "media-news-current-events",         "title": {"en": "Media, News & Current Events",                 "tr": "Medya, Haberler ve Güncel Olaylar"}},
            {"exercise_key": "technology-digital-life",           "title": {"en": "Technology & Digital Life",                     "tr": "Teknoloji ve Dijital Yaşam"}},
            {"exercise_key": "society-politics-community",        "title": {"en": "Society, Politics & Community",                 "tr": "Toplum, Siyaset ve Topluluk"}},
            {"exercise_key": "family-social-relationships",       "title": {"en": "Family Life & Social Relationships",            "tr": "Aile Yaşamı ve Sosyal İlişkiler"}},
            {"exercise_key": "clothes-identity-self-expression",  "title": {"en": "Clothes, Identity & Self-expression",           "tr": "Giyim, Kimlik ve Kendini İfade Etme"}},
            {"exercise_key": "time-planning-life-goals",          "title": {"en": "Time, Planning & Life Goals",                   "tr": "Zaman, Planlama ve Hayat Hedefleri"}},
        ]
    },
    "B2": {
        "level": "B2",
        "description": {
            "en": "Upper-intermediate level – advanced grammar and expression.",
            "tr": "Üst-orta seviye – ileri dilbilgisi ve anlatım."
        },
        "exercises": [
            {"exercise_key": "b2_ex_1",  "title": {"en": "Exercise 1",  "tr": "Alıştırma 1"}},
            {"exercise_key": "b2_ex_2",  "title": {"en": "Exercise 2",  "tr": "Alıştırma 2"}},
            {"exercise_key": "b2_ex_3",  "title": {"en": "Exercise 3",  "tr": "Alıştırma 3"}},
            {"exercise_key": "b2_ex_4",  "title": {"en": "Exercise 4",  "tr": "Alıştırma 4"}},
            {"exercise_key": "b2_ex_5",  "title": {"en": "Exercise 5",  "tr": "Alıştırma 5"}},
            {"exercise_key": "b2_ex_6",  "title": {"en": "Exercise 6",  "tr": "Alıştırma 6"}},
            {"exercise_key": "b2_ex_7",  "title": {"en": "Exercise 7",  "tr": "Alıştırma 7"}},
            {"exercise_key": "b2_ex_8",  "title": {"en": "Exercise 8",  "tr": "Alıştırma 8"}},
            {"exercise_key": "b2_ex_9",  "title": {"en": "Exercise 9",  "tr": "Alıştırma 9"}},
            {"exercise_key": "b2_ex_10", "title": {"en": "Exercise 10", "tr": "Alıştırma 10"}},
        ]
    },
    "C1": {
        "level": "C1",
        "description": {
            "en": "Advanced level – sophisticated German grammar and style.",
            "tr": "İleri seviye – gelişmiş Almanca dilbilgisi ve üslup."
        },
        "exercises": [
            {"exercise_key": "c1_ex_1",  "title": {"en": "Exercise 1",  "tr": "Alıştırma 1"}},
            {"exercise_key": "c1_ex_2",  "title": {"en": "Exercise 2",  "tr": "Alıştırma 2"}},
            {"exercise_key": "c1_ex_3",  "title": {"en": "Exercise 3",  "tr": "Alıştırma 3"}},
            {"exercise_key": "c1_ex_4",  "title": {"en": "Exercise 4",  "tr": "Alıştırma 4"}},
            {"exercise_key": "c1_ex_5",  "title": {"en": "Exercise 5",  "tr": "Alıştırma 5"}},
            {"exercise_key": "c1_ex_6",  "title": {"en": "Exercise 6",  "tr": "Alıştırma 6"}},
            {"exercise_key": "c1_ex_7",  "title": {"en": "Exercise 7",  "tr": "Alıştırma 7"}},
            {"exercise_key": "c1_ex_8",  "title": {"en": "Exercise 8",  "tr": "Alıştırma 8"}},
            {"exercise_key": "c1_ex_9",  "title": {"en": "Exercise 9",  "tr": "Alıştırma 9"}},
            {"exercise_key": "c1_ex_10", "title": {"en": "Exercise 10", "tr": "Alıştırma 10"}},
        ]
    },
    "C2": {
        "level": "C2",
        "description": {
            "en": "Mastery level – near-native German proficiency exercises.",
            "tr": "Ustalık seviyesi – ana dili düzeyine yakın Almanca alıştırmaları."
        },
        "exercises": [
            {"exercise_key": "c2_ex_1",  "title": {"en": "Exercise 1",  "tr": "Alıştırma 1"}},
            {"exercise_key": "c2_ex_2",  "title": {"en": "Exercise 2",  "tr": "Alıştırma 2"}},
            {"exercise_key": "c2_ex_3",  "title": {"en": "Exercise 3",  "tr": "Alıştırma 3"}},
            {"exercise_key": "c2_ex_4",  "title": {"en": "Exercise 4",  "tr": "Alıştırma 4"}},
            {"exercise_key": "c2_ex_5",  "title": {"en": "Exercise 5",  "tr": "Alıştırma 5"}},
            {"exercise_key": "c2_ex_6",  "title": {"en": "Exercise 6",  "tr": "Alıştırma 6"}},
            {"exercise_key": "c2_ex_7",  "title": {"en": "Exercise 7",  "tr": "Alıştırma 7"}},
            {"exercise_key": "c2_ex_8",  "title": {"en": "Exercise 8",  "tr": "Alıştırma 8"}},
            {"exercise_key": "c2_ex_9",  "title": {"en": "Exercise 9",  "tr": "Alıştırma 9"}},
            {"exercise_key": "c2_ex_10", "title": {"en": "Exercise 10", "tr": "Alıştırma 10"}},
        ]
    },
}

LEVELS_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"]
