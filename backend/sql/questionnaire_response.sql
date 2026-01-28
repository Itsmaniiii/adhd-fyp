CREATE TABLE IF NOT EXISTS questionnaire_response (
  id SERIAL PRIMARY KEY,
  child_id INT REFERENCES child_profile(id),
  question TEXT,
  answer INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
