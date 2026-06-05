CREATE TABLE IF NOT EXISTS questionnaire_response (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
