
-- sos_contacts: доверенные контакты пользователя (поддерживает МНОЖЕСТВЕННЫЕ записи)
CREATE TABLE IF NOT EXISTS t_p59418632_flashmeet_system.sos_contacts (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    guardian_id BIGINT,                        -- Telegram user_id хранителя (если уже в боте)
    username    TEXT NOT NULL,                 -- @username как ввёл пользователь
    is_active   BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE после нажатия /start по реф. ссылке
    ref_token   TEXT,                          -- токен для ссылки t.me/FlashMeet_bot?start=guard_TOKEN
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sos_contacts_user_id   ON t_p59418632_flashmeet_system.sos_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_sos_contacts_guardian  ON t_p59418632_flashmeet_system.sos_contacts(guardian_id);
CREATE INDEX IF NOT EXISTS idx_sos_contacts_ref_token ON t_p59418632_flashmeet_system.sos_contacts(ref_token);

-- user_subscriptions: подписки Организатора (роль organizer + срок действия)
CREATE TABLE IF NOT EXISTS t_p59418632_flashmeet_system.user_subscriptions (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL UNIQUE,
    role        TEXT NOT NULL DEFAULT 'user',  -- 'user' | 'organizer'
    plan        TEXT,                          -- 'organizer_day' | 'organizer_week' | 'organizer_month'
    expires_at  TIMESTAMPTZ,                   -- NULL = бессрочно / нет подписки
    gateway     TEXT,                          -- 'robokassa' | 'telegram_stars'
    order_id    TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id    ON t_p59418632_flashmeet_system.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_expires_at ON t_p59418632_flashmeet_system.user_subscriptions(expires_at);

-- organizer_slots: активные слоты Организатора в ленте (лимит: 1 на user_id)
CREATE TABLE IF NOT EXISTS t_p59418632_flashmeet_system.organizer_slots (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL UNIQUE,       -- UNIQUE гарантирует 1 слот на аккаунт
    format       TEXT NOT NULL,                -- 'venue' (Заведение) | 'event' (Событие)
    title        TEXT NOT NULL,
    description  TEXT,
    tags         TEXT[],                       -- массив тегов
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_organizer_slots_user_id   ON t_p59418632_flashmeet_system.organizer_slots(user_id);
CREATE INDEX IF NOT EXISTS idx_organizer_slots_is_active ON t_p59418632_flashmeet_system.organizer_slots(is_active);

-- organizer_templates: шаблоны для быстрой публикации после 07:00 МСК
CREATE TABLE IF NOT EXISTS t_p59418632_flashmeet_system.organizer_templates (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    name        TEXT NOT NULL,                 -- название шаблона (для CRM-кабинета)
    format      TEXT NOT NULL,                 -- 'venue' | 'event'
    title       TEXT NOT NULL,
    description TEXT,
    tags        TEXT[],
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_organizer_templates_user_id ON t_p59418632_flashmeet_system.organizer_templates(user_id);
