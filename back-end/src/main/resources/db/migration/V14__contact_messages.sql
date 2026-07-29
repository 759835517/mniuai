-- V14: Contact messages table for website contact form
CREATE TABLE IF NOT EXISTS contact_messages (
    id          BIGINT NOT NULL,
    name        VARCHAR(50) NOT NULL,
    email       VARCHAR(100) NOT NULL,
    type        VARCHAR(30) NOT NULL,
    message     TEXT NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);
