"""
FlashMeet — модуль платёжных шлюзов.

Роль: organizer (объединяет Бизнес, Блогер, Гид).
Форматы встречи при создании слота: 'venue' (Заведение) или 'event' (Событие).

RU-пользователи  → Робокасса (ссылка на оплату с подписью MD5)
EN-пользователи  → Telegram Stars (возвращает параметры для sendInvoice)

POST /
{
  "user_id":    123,
  "lang":       "ru" | "en",
  "plan":       "organizer_day" | "organizer_week" | "organizer_month",
  "order_id":   "ord_123_456"    // уникальный ID заказа (генерирует бот)
}

Ответ RU:
{
  "gateway": "robokassa",
  "payment_url": "https://auth.robokassa.ru/Merchant/Index.aspx?..."
}

Ответ EN:
{
  "gateway": "telegram_stars",
  "invoice": {
    "title": "FlashMeet Организатор — 1 день",
    "description": "...",
    "payload": "organizer_day:123:ord_123_456",
    "currency": "XTR",
    "prices": [{"label": "FlashMeet Организатор", "amount": 130}],
    "provider_token": ""
  }
}
"""

import hashlib
import json
import os

PLANS = {
    "organizer_day": {
        "amount_rub": 19000,       # в копейках → 190 ₽
        "amount_stars": 130,       # Telegram Stars
        "desc_ru": "FlashMeet Организатор — 1 день",
        "desc_en": "FlashMeet Organizer — 1 day",
    },
    "organizer_week": {
        "amount_rub": 79000,       # 790 ₽
        "amount_stars": 550,
        "desc_ru": "FlashMeet Организатор — 1 неделя",
        "desc_en": "FlashMeet Organizer — 1 week",
    },
    "organizer_month": {
        "amount_rub": 249000,      # 2490 ₽
        "amount_stars": 1750,
        "desc_ru": "FlashMeet Организатор — 1 месяц",
        "desc_en": "FlashMeet Organizer — 1 month",
    },
}


def _robokassa_url(merchant: str, password1: str, amount_rub_kopecks: int,
                   order_id: str, description: str) -> str:
    amount_str = f"{amount_rub_kopecks / 100:.2f}"
    sig_raw = f"{merchant}:{amount_str}:{order_id}:{password1}"
    signature = hashlib.md5(sig_raw.encode("utf-8")).hexdigest()
    from urllib.parse import urlencode
    params = {
        "MerchantLogin": merchant,
        "OutSum": amount_str,
        "InvId": order_id,
        "Description": description,
        "SignatureValue": signature,
        "IsTest": "0",
    }
    return "https://auth.robokassa.ru/Merchant/Index.aspx?" + urlencode(params)


def _stars_invoice(user_id: int, plan_id: str, order_id: str, plan: dict) -> dict:
    return {
        "title": plan["desc_en"],
        "description": plan["desc_en"],
        "payload": f"{plan_id}:{user_id}:{order_id}",
        "currency": "XTR",
        "prices": [{"label": "FlashMeet Organizer", "amount": plan["amount_stars"]}],
        "provider_token": "",
    }


def handler(event: dict, context) -> dict:
    """
    Платёжный роутер FlashMeet: Робокасса (RU) / Telegram Stars (EN).
    Тарифы: organizer_day (190₽/130⭐), organizer_week (790₽/550⭐), organizer_month (2490₽/1750⭐).
    """
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    raw = event.get("body") or "{}"
    if isinstance(raw, dict):
        body = raw
    else:
        try:
            parsed = json.loads(raw)
            body = json.loads(parsed) if isinstance(parsed, str) else parsed
        except Exception:
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "invalid json"})}

    if not isinstance(body, dict):
        return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "body must be json object"})}

    user_id = int(body.get("user_id", 0))
    lang = body.get("lang", "ru")
    plan_id = body.get("plan", "organizer_month")
    order_id = str(body.get("order_id", f"auto_{user_id}"))

    if not user_id:
        return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "user_id required"})}

    plan = PLANS.get(plan_id)
    if not plan:
        return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": f"unknown plan: {plan_id}"})}

    if lang == "en":
        invoice = _stars_invoice(user_id, plan_id, order_id, plan)
        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({"gateway": "telegram_stars", "invoice": invoice}),
        }

    # RU — Робокасса
    merchant = os.environ.get("ROBOKASSA_MERCHANT_LOGIN", "")
    password1 = os.environ.get("ROBOKASSA_PASSWORD1", "")

    if not merchant or not password1:
        return {
            "statusCode": 503,
            "headers": cors,
            "body": json.dumps({"error": "Robokassa credentials not configured"}),
        }

    payment_url = _robokassa_url(
        merchant, password1,
        plan["amount_rub"],
        order_id,
        plan["desc_ru"],
    )
    return {
        "statusCode": 200,
        "headers": cors,
        "body": json.dumps({"gateway": "robokassa", "payment_url": payment_url}),
    }