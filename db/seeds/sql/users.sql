CREATE TABLE users (
    username TEXT PRIMARY KEY UNIQUE,
    avatar_url TEXT,
    name TEXT NOT NULL
  );