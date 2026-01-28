CREATE TABLE IF NOT EXISTS genetic_history (
  id SERIAL PRIMARY KEY,
  child_id INT REFERENCES child_profile(id),
  parent_speech_delay BOOLEAN,
  parent_attention_issue BOOLEAN,
  sibling_delay BOOLEAN,
  premature_birth BOOLEAN
);
