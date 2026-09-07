-- Sandbox Users Table Schema
CREATE TABLE IF NOT EXISTS sandbox_users (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sandbox_users_email ON sandbox_users(email);
