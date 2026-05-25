"""
FlashMeet — админ-панель: просмотр подозреваемых аккаунтов (fake farm suspects).

Защищена токеном: заголовок X-Admin-Token должен совпадать с ADMIN_TOKEN из env.

GET  /              — список неотрецензированных подозрений (reviewed=false)
GET  /?all=1        — все записи, включая отрецензированные
POST / { "id": 5, "action": "dismiss" | "ban", "note": "..." }
                    — отметить запись как отрецензированную
"""

import json
import os
import psycopg2

SCHEMA = "t_p59418632_flashmeet_system"


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def check_auth(event: dict) -> bool:
    token = os.environ.get("ADMIN_TOKEN", "")
    if not token:
        return False
    headers = event.get("headers") or {}
    provided = (
        headers.get("X-Admin-Token")
        or headers.get("x-admin-token")
        or (event.get("queryStringParameters") or {}).get("token", "")
    )
    return provided == token


def handler(event: dict, context) -> dict:
    """
    Админ-эндпоинт для просмотра и обработки подозреваемых в fake-farm.
    Требует заголовок X-Admin-Token.
    """
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    if not check_auth(event):
        return {"statusCode": 401, "headers": cors, "body": {"error": "unauthorized"}}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}

    if method == "GET":
        show_all = params.get("all") == "1"
        with get_conn() as conn:
            with conn.cursor() as cur:
                if show_all:
                    cur.execute(
                        f"""
                        SELECT id, user_ids, lat, lon, detected_at, reviewed, note
                        FROM {SCHEMA}.fake_farm_suspects
                        ORDER BY detected_at DESC
                        LIMIT 100
                        """
                    )
                else:
                    cur.execute(
                        f"""
                        SELECT id, user_ids, lat, lon, detected_at, reviewed, note
                        FROM {SCHEMA}.fake_farm_suspects
                        WHERE reviewed = FALSE
                        ORDER BY detected_at DESC
                        LIMIT 100
                        """
                    )
                rows = cur.fetchall()

        suspects = [
            {
                "id": r[0],
                "user_ids": r[1],
                "lat": r[2],
                "lon": r[3],
                "detected_at": r[4].isoformat() if r[4] else None,
                "reviewed": r[5],
                "note": r[6],
            }
            for r in rows
        ]
        return {"statusCode": 200, "headers": cors, "body": {"suspects": suspects, "count": len(suspects)}}

    if method == "POST":
        raw = event.get("body") or "{}"
        if isinstance(raw, dict):
            body = raw
        else:
            try:
                parsed = json.loads(raw)
                body = json.loads(parsed) if isinstance(parsed, str) else parsed
            except Exception:
                return {"statusCode": 400, "headers": cors, "body": {"error": "invalid json"}}

        record_id = int(body.get("id", 0))
        action = body.get("action", "dismiss")
        note = body.get("note", "")

        if not record_id:
            return {"statusCode": 400, "headers": cors, "body": {"error": "id required"}}

        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    f"""
                    UPDATE {SCHEMA}.fake_farm_suspects
                    SET reviewed = TRUE,
                        note = COALESCE(%s, note) || ' [' || %s || ']'
                    WHERE id = %s
                    """,
                    (note, action, record_id),
                )
                updated = cur.rowcount
            conn.commit()

        if updated == 0:
            return {"statusCode": 404, "headers": cors, "body": {"error": "record not found"}}

        return {"statusCode": 200, "headers": cors, "body": {"ok": True, "id": record_id, "action": action}}

    return {"statusCode": 405, "headers": cors, "body": {"error": "method not allowed"}}
