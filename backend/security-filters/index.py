"""
FlashMeet — модуль фильтров безопасности.
Принимает POST-запросы от Telegram-бота и применяет 4 фильтра:
  1. link_block     — блокировка ссылок у роли 'user'
  2. stopword_check — коммерческие стоп-слова в категории 'Люди'
  3. name_check     — запрет бизнес-слов в поле имени анкеты
  4. gps_farm       — запись GPS и детекция ферм фейков
"""

import json
import os
import math
import psycopg2
import re
from datetime import datetime, timezone

SCHEMA = "t_p59418632_flashmeet_system"

LINK_PATTERN = re.compile(
    r"(https?://|www\.|t\.me/|[a-zA-Z0-9\-]+\.(ru|com|org|net|io|app))",
    re.IGNORECASE,
)

COMMERCIAL_STOPWORDS = [
    "скидка", "акция", "промокод", "бар", "кафе", "ресторан",
    "экскурсия", "билеты", "вход свободный",
]

NAME_STOPWORDS = ["бар", "кафе", "клуб", "гид", "экскурсовод", "тур"]

GPS_RADIUS_METERS = 100
GPS_WINDOW_HOURS = 24
GPS_MIN_ACCOUNTS = 3


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def _log_blocked(cur, user_id: int, filter_id: int, text: str):
    cur.execute(
        f"INSERT INTO {SCHEMA}.blocked_messages (user_id, filter_id, message_text) VALUES (%s, %s, %s)",
        (user_id, filter_id, text[:2000] if text else None),
    )


def filter_link_block(user_id: int, role: str, text: str) -> dict:
    """Фильтр 1: блокирует ссылки для роли 'user'."""
    if role != "user":
        return {"blocked": False}
    if LINK_PATTERN.search(text or ""):
        with get_conn() as conn:
            with conn.cursor() as cur:
                _log_blocked(cur, user_id, 1, text)
            conn.commit()
        return {
            "blocked": True,
            "filter": "link_block",
            "message": "⛔ Ссылки запрещены для обычных пользователей. Зарегистрируйте заведение или аккаунт блогера через /role.",
        }
    return {"blocked": False}


def filter_stopword_check(user_id: int, role: str, category: str, text: str) -> dict:
    """Фильтр 2: коммерческие стоп-слова в категории 'Люди'."""
    if role != "user" or category != "people":
        return {"blocked": False}
    text_lower = (text or "").lower()
    for word in COMMERCIAL_STOPWORDS:
        if word in text_lower:
            with get_conn() as conn:
                with conn.cursor() as cur:
                    _log_blocked(cur, user_id, 2, text)
                conn.commit()
            return {
                "blocked": True,
                "filter": "stopword_check",
                "trigger_word": word,
                "message": (
                    f'⛔ Обнаружено коммерческое слово «{word}».\n'
                    "Для продвижения заведений и услуг используйте роль Бизнес или Гид — команда /role."
                ),
            }
    return {"blocked": False}


def filter_name_check(user_id: int, name: str) -> dict:
    """Фильтр 3: запрет бизнес-слов в имени анкеты."""
    name_lower = (name or "").lower()
    for word in NAME_STOPWORDS:
        if word in name_lower:
            return {
                "blocked": True,
                "filter": "name_check",
                "trigger_word": word,
                "message": (
                    "⛔ Пожалуйста, введи настоящее имя.\n"
                    "Названия заведений и коммерческие слова в имени не допускаются."
                ),
            }
    return {"blocked": False}


def _haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Расстояние между двумя точками в метрах."""
    R = 6_371_000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def filter_gps_farm(user_id: int, lat: float, lon: float) -> dict:
    """Фильтр 4: запись GPS-точки и детекция ферм фейков."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            # Сохраняем точку и сразу коммитим, чтобы SELECT видел новую запись
            cur.execute(
                f"INSERT INTO {SCHEMA}.gps_logs (user_id, lat, lon) VALUES (%s, %s, %s)",
                (user_id, lat, lon),
            )
        conn.commit()

        with conn.cursor() as cur:
            # Ищем аккаунты, публиковавшие из той же зоны за последние GPS_WINDOW_HOURS часов
            cur.execute(
                f"""
                SELECT DISTINCT user_id
                FROM {SCHEMA}.gps_logs
                WHERE recorded_at > NOW() - INTERVAL '{GPS_WINDOW_HOURS} hours'
                  AND user_id != %s
                  AND ABS(lat - %s) < 0.002
                  AND ABS(lon - %s) < 0.002
                """,
                (user_id, lat, lon),
            )
            nearby_raw = [row[0] for row in cur.fetchall()]

            nearby_confirmed = set()
            if nearby_raw:
                # Уточняем по реальному расстоянию через IN-список (без ANY(%s) для массива)
                placeholders = ",".join(["%s"] * len(nearby_raw))
                cur.execute(
                    f"SELECT DISTINCT ON (user_id) user_id, lat, lon FROM {SCHEMA}.gps_logs"
                    f" WHERE user_id IN ({placeholders})"
                    f" ORDER BY user_id, recorded_at DESC",
                    nearby_raw,
                )
                for row in cur.fetchall():
                    if _haversine_m(lat, lon, row[1], row[2]) <= GPS_RADIUS_METERS:
                        nearby_confirmed.add(row[0])

            suspect_ids = list(nearby_confirmed)
            # farm_detected если ИТОГО аккаунтов (включая текущего) >= GPS_MIN_ACCOUNTS
            farm_detected = (len(suspect_ids) + 1) >= GPS_MIN_ACCOUNTS

            if farm_detected:
                all_ids = [user_id] + suspect_ids
                # Проверяем, не зафиксирован ли уже этот кластер
                cur.execute(
                    f"""
                    SELECT id FROM {SCHEMA}.fake_farm_suspects
                    WHERE %s && user_ids
                      AND detected_at > NOW() - INTERVAL '48 hours'
                      AND reviewed = FALSE
                    LIMIT 1
                    """,
                    (all_ids,),
                )
                already = cur.fetchone()
                if not already:
                    cur.execute(
                        f"""
                        INSERT INTO {SCHEMA}.fake_farm_suspects (user_ids, lat, lon, note)
                        VALUES (%s, %s, %s, %s)
                        """,
                        (
                            all_ids,
                            lat,
                            lon,
                            f"Автодетекция: {len(all_ids)} аккаунтов в радиусе {GPS_RADIUS_METERS}м за {GPS_WINDOW_HOURS}ч",
                        ),
                    )

        conn.commit()

    if farm_detected:
        return {
            "blocked": False,
            "farm_alert": True,
            "suspect_ids": suspect_ids,
            "message": "🚨 Подозрение на ферму фейков зафиксировано и передано администратору.",
        }
    return {"blocked": False, "farm_alert": False}


def handler(event: dict, context) -> dict:
    """
    Единая точка входа для всех фильтров безопасности FlashMeet.

    Ожидает POST с JSON:
    {
      "filter":   "link_block" | "stopword_check" | "name_check" | "gps_farm",
      "user_id":  12345,
      "role":     "user" | "business" | "blogger" | "guide",
      "text":     "...",        // для link_block, stopword_check
      "category": "people",     // для stopword_check
      "name":     "...",        // для name_check
      "lat":      55.75,        // для gps_farm
      "lon":      37.62         // для gps_farm
    }

    Возвращает:
    {
      "blocked":  true | false,
      "filter":   "...",
      "message":  "Текст для пользователя",  // если blocked=true
      "farm_alert": true | false              // только для gps_farm
    }
    """
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    raw_body = event.get("body") or "{}"
    if isinstance(raw_body, dict):
        body = raw_body
    else:
        try:
            parsed = json.loads(raw_body)
            # двойная сериализация: если результат — строка, парсим ещё раз
            body = json.loads(parsed) if isinstance(parsed, str) else parsed
        except (json.JSONDecodeError, TypeError):
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "invalid json"})}
    # финальная защита
    if not isinstance(body, dict):
        return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "body must be a json object"})}

    filter_name = body.get("filter")
    user_id = int(body.get("user_id", 0))
    role = body.get("role", "user")

    if not filter_name or not user_id:
        return {
            "statusCode": 400,
            "headers": cors,
            "body": json.dumps({"error": "filter and user_id are required"}),
        }

    if filter_name == "link_block":
        result = filter_link_block(user_id, role, body.get("text", ""))

    elif filter_name == "stopword_check":
        result = filter_stopword_check(user_id, role, body.get("category", ""), body.get("text", ""))

    elif filter_name == "name_check":
        result = filter_name_check(user_id, body.get("name", ""))

    elif filter_name == "gps_farm":
        lat = body.get("lat")
        lon = body.get("lon")
        if lat is None or lon is None:
            return {
                "statusCode": 400,
                "headers": cors,
                "body": json.dumps({"error": "lat and lon required for gps_farm"}),
            }
        result = filter_gps_farm(user_id, float(lat), float(lon))

    else:
        return {
            "statusCode": 400,
            "headers": cors,
            "body": json.dumps({"error": f"unknown filter: {filter_name}"}),
        }

    return {"statusCode": 200, "headers": cors, "body": json.dumps(result)}