"""
FlashMeet — модуль интернационализации (i18n).
Хранит переводы интерфейса бота на RU/EN и отдаёт нужный язык по запросу.

Поддерживаемые языки: ru (по умолчанию), en
GET  /?lang=ru           — получить все строки на языке
POST /                   — сохранить/обновить язык пользователя
     { "user_id": 123, "lang": "en" }
GET  /?user_id=123       — получить язык пользователя + строки
"""

import json
import os
import psycopg2

SCHEMA = "t_p59418632_flashmeet_system"

TRANSLATIONS = {
    "ru": {
        "lang_code": "ru",
        "start_welcome": "👋 Привет! Я FlashMeet — бот для быстрых живых встреч.\n\nВыбери язык:",
        "btn_lang_ru": "🇷🇺 Русский",
        "btn_lang_en": "🇬🇧 English",
        "menu_find": "🔍 Найти встречу",
        "menu_create": "➕ Создать предложение",
        "menu_profile": "👤 Мой профиль",
        "menu_safety": "🛡 Безопасность",
        "menu_role": "🏷 Сменить роль",
        "menu_subscribe": "⭐ Подписка",
        "ask_name": "Как тебя зовут? (настоящее имя)",
        "ask_age": "Сколько тебе лет?",
        "ask_gender": "Твой пол:",
        "btn_male": "👨 Мужчина",
        "btn_female": "👩 Женщина",
        "ask_category": "Выбери категорию встречи:",
        "cat_people": "👥 Люди",
        "cat_business": "🏢 Заведения",
        "cat_events": "🎉 Мероприятия",
        "ask_comment": "Добавь короткий комментарий к встрече (до 200 символов):",
        "offer_created": "✅ Предложение опубликовано! Ждём мэтча...",
        "match_found": "🎯 Мэтч найден! Познакомьтесь:",
        "gps_prompt": "🛰 Хочешь активировать GPS-защиту на время встречи?\nТвои координаты будут скрыты от собеседника.",
        "btn_gps_on": "✅ Включить GPS-защиту",
        "btn_gps_off": "❌ Пропустить",
        "sos_sent": "🚨 SOS-сигнал отправлен! Помощь уже в пути.",
        "timer_ok": "✅ Отметиться — всё в порядке",
        "timer_expired": "⏰ Таймер истёк. Запускаю SOS-протокол...",
        "subscribe_title": "⭐ Подписка FlashMeet Business",
        "subscribe_desc": "Открывает роль Бизнес/Блогер/Гид, CRM и расширенные SOS-пакеты.",
        "subscribe_price_rub": "490 ₽ / месяц",
        "payment_link_rub": "💳 Оплатить через Робокассу:",
        "role_changed": "✅ Роль успешно изменена!",
        "error_link_blocked": "⛔ Ссылки запрещены для обычных пользователей. Зарегистрируй заведение через /role.",
        "error_stopword": "⛔ Обнаружено коммерческое слово. Используй роль Бизнес или Гид — команда /role.",
        "error_fake_name": "⛔ Введи настоящее имя. Названия заведений не допускаются.",
        "error_age": "⛔ Сервис доступен только с 18 лет.",
        "farm_suspect_admin": "🚨 Подозрение на ферму: {count} аккаунтов в одной точке. ID: {ids}",
    },
    "en": {
        "lang_code": "en",
        "start_welcome": "👋 Hi! I'm FlashMeet — a bot for quick real-life meetups.\n\nChoose your language:",
        "btn_lang_ru": "🇷🇺 Русский",
        "btn_lang_en": "🇬🇧 English",
        "menu_find": "🔍 Find a meetup",
        "menu_create": "➕ Create offer",
        "menu_profile": "👤 My profile",
        "menu_safety": "🛡 Safety",
        "menu_role": "🏷 Change role",
        "menu_subscribe": "⭐ Subscription",
        "ask_name": "What's your name? (real name please)",
        "ask_age": "How old are you?",
        "ask_gender": "Your gender:",
        "btn_male": "👨 Male",
        "btn_female": "👩 Female",
        "ask_category": "Choose meetup category:",
        "cat_people": "👥 People",
        "cat_business": "🏢 Venues",
        "cat_events": "🎉 Events",
        "ask_comment": "Add a short comment to your offer (up to 200 chars):",
        "offer_created": "✅ Offer published! Waiting for a match...",
        "match_found": "🎯 Match found! Say hi:",
        "gps_prompt": "🛰 Want to activate GPS protection during the meetup?\nYour coordinates stay hidden from your match.",
        "btn_gps_on": "✅ Enable GPS protection",
        "btn_gps_off": "❌ Skip",
        "sos_sent": "🚨 SOS signal sent! Help is on the way.",
        "timer_ok": "✅ I'm OK — check in",
        "timer_expired": "⏰ Timer expired. Triggering SOS protocol...",
        "subscribe_title": "⭐ FlashMeet Business Subscription",
        "subscribe_desc": "Unlocks Business/Blogger/Guide roles, CRM and extended SOS packages.",
        "subscribe_price_stars": "50 ⭐ / month",
        "payment_stars_invoice": "Pay with Telegram Stars",
        "role_changed": "✅ Role updated successfully!",
        "error_link_blocked": "⛔ Links are not allowed for regular users. Register your venue via /role.",
        "error_stopword": "⛔ Commercial keyword detected. Use Business or Guide role — /role command.",
        "error_fake_name": "⛔ Please enter your real name. Business names are not allowed.",
        "error_age": "⛔ This service is only available for users 18+.",
        "farm_suspect_admin": "🚨 Fake farm suspected: {count} accounts at same location. IDs: {ids}",
    },
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ensure_lang_table(cur):
    cur.execute(f"""
        CREATE TABLE IF NOT EXISTS {SCHEMA}.user_languages (
            user_id  BIGINT PRIMARY KEY,
            lang     VARCHAR(8) NOT NULL DEFAULT 'ru',
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    """)


def get_user_lang(user_id: int) -> str:
    try:
        with get_conn() as conn:
            with conn.cursor() as cur:
                ensure_lang_table(cur)
                cur.execute(
                    f"SELECT lang FROM {SCHEMA}.user_languages WHERE user_id = %s",
                    (user_id,),
                )
                row = cur.fetchone()
                conn.commit()
                return row[0] if row else "ru"
    except Exception as _e:
        return "ru"


def set_user_lang(user_id: int, lang: str) -> None:
    with get_conn() as conn:
        with conn.cursor() as cur:
            ensure_lang_table(cur)
            cur.execute(
                f"""
                INSERT INTO {SCHEMA}.user_languages (user_id, lang)
                VALUES (%s, %s)
                ON CONFLICT (user_id) DO UPDATE SET lang = EXCLUDED.lang, updated_at = NOW()
                """,
                (user_id, lang),
            )
        conn.commit()


def handler(event: dict, context) -> dict:
    """
    i18n-сервис FlashMeet.

    GET  /?lang=ru|en           — вернуть словарь переводов
    GET  /?user_id=123          — вернуть язык + словарь для пользователя
    POST / {user_id, lang}      — сохранить язык пользователя
    """
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}

    if method == "POST":
        raw = event.get("body") or "{}"
        if isinstance(raw, dict):
            body = raw
        else:
            try:
                parsed = json.loads(raw)
                body = json.loads(parsed) if isinstance(parsed, str) else parsed
            except Exception:
                return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "invalid json"})}

        user_id = int(body.get("user_id", 0))
        lang = body.get("lang", "ru")
        if not user_id:
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "user_id required"})}
        if lang not in TRANSLATIONS:
            lang = "ru"
        set_user_lang(user_id, lang)
        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({"ok": True, "lang": lang, "strings": TRANSLATIONS[lang]}),
        }

    # GET
    user_id_str = params.get("user_id")
    if user_id_str:
        lang = get_user_lang(int(user_id_str))
    else:
        lang = params.get("lang", "ru")
        if lang not in TRANSLATIONS:
            lang = "ru"

    return {
        "statusCode": 200,
        "headers": cors,
        "body": json.dumps({"lang": lang, "strings": TRANSLATIONS[lang]}),
    }