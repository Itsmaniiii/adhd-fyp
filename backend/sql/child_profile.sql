CREATE TABLE IF NOT EXISTS child_profile (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  name VARCHAR(50),
  age_months INT,
  gender VARCHAR(10),
  weight FLOAT,
  height FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
