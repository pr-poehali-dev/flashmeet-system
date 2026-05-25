"""
FlashMeet — модуль платёжных шлюзов.

RU-пользователи  → Робокасса (ссылка на оплату с подписью MD5)
EN-пользователи  → Telegram Stars (возвращает параметры для sendInvoice)

POST /
{
  "user_id":    123,
  "lang":       "ru" | "en",
  "plan":       "business_monthly",
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
    "title": "FlashMeet Business — 1 month",
    "description": "Unlocks Business/Blogger/Guide roles, CRM and extended SOS",
    "payload": "business_monthly:123:ord_123_456",
    "currency": "XTR",
    "prices": [{"label": "FlashMeet Business", "amount": 50}],
    "provider_token": ""
  }
}
"""

import hashlib
import json
import os

PLANS = {
    "business_monthly": {
        "amount_rub": 49000,   # в копейках → 490 ₽
        "amount_stars": 50,    # Telegram Stars
        "desc_ru": "Подписка FlashMeet Business — 1 месяц",
        "desc_en": "FlashMeet Business Subscription — 1 month",
    },
    "business_yearly": {
        "amount_rub": 390000,  # 3900 ₽
        "amount_stars": 400,
        "desc_ru": "Подписка FlashMeet Business — 12 месяцев",
        "desc_en": "FlashMeet Business Subscription — 12 months",
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
        "title": "FlashMeet Business",
        "description": plan["desc_en"],
        "payload": f"{plan_id}:{user_id}:{order_id}",
        "currency": "XTR",
        "prices": [{"label": "FlashMeet Business", "amount": plan["amount_stars"]}],
        "provider_token": "",
    }


def handler(event: dict, context) -> dict:
    """
    Платёжный роутер FlashMeet: Робокасса (RU) / Telegram Stars (EN).
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
            return {"statusCode": 400, "headers": cors, "body": {"error": "invalid json"}}

    if not isinstance(body, dict):
        return {"statusCode": 400, "headers": cors, "body": {"error": "body must be json object"}}

    user_id = int(body.get("user_id", 0))
    lang = body.get("lang", "ru")
    plan_id = body.get("plan", "business_monthly")
    order_id = str(body.get("order_id", f"auto_{user_id}"))

    if not user_id:
        return {"statusCode": 400, "headers": cors, "body": {"error": "user_id required"}}

    plan = PLANS.get(plan_id)
    if not plan:
        return {"statusCode": 400, "headers": cors, "body": {"error": f"unknown plan: {plan_id}"}}

    if lang == "en":
        invoice = _stars_invoice(user_id, plan_id, order_id, plan)
        return {
            "statusCode": 200,
            "headers": cors,
            "body": {"gateway": "telegram_stars", "invoice": invoice},
        }

    # RU — Робокасса
    merchant = os.environ.get("ROBOKASSA_MERCHANT_LOGIN", "")
    password1 = os.environ.get("ROBOKASSA_PASSWORD1", "")

    if not merchant or not password1:
        return {
            "statusCode": 503,
            "headers": cors,
            "body": {"error": "Robokassa credentials not configured"},
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
        "body": {"gateway": "robokassa", "payment_url": payment_url},
    }
