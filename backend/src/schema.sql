-- Schema for the Dynamic Sentence Builder app.

CREATE TABLE IF NOT EXISTS word_types (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS words (
  id      SERIAL PRIMARY KEY,
  text    VARCHAR(100) NOT NULL,
  type_id INTEGER NOT NULL REFERENCES word_types(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sentences (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(150) NOT NULL DEFAULT 'Untitled sentence',
  content    TEXT NOT NULL,
  word_ids   INTEGER[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
