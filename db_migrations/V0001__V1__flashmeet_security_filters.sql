CREATE TABLE IF NOT EXISTS t_p59418632_flashmeet_system.gps_logs (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT      NOT NULL,
    lat         DOUBLE PRECISION NOT NULL,
    lon         DOUBLE PRECISION NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gps_logs_user_id     ON t_p59418632_flashmeet_system.gps_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_gps_logs_recorded_at ON t_p59418632_flashmeet_system.gps_logs(recorded_at);

CREATE TABLE IF NOT EXISTS t_p59418632_flashmeet_system.fake_farm_suspects (
    id          BIGSERIAL PRIMARY KEY,
    user_ids    BIGINT[]    NOT NULL,
    lat         DOUBLE PRECISION NOT NULL,
    lon         DOUBLE PRECISION NOT NULL,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed    BOOLEAN     NOT NULL DEFAULT FALSE,
    note        TEXT
);

CREATE TABLE IF NOT EXISTS t_p59418632_flashmeet_system.blocked_messages (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT      NOT NULL,
    filter_id    SMALLINT    NOT NULL,
    message_text TEXT,
    blocked_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blocked_user_id ON t_p59418632_flashmeet_system.blocked_messages(user_id);
