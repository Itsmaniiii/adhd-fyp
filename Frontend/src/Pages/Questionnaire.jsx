import React, { useState } from "react";
import SeverityChecker from "../component/SeverityMeter";

const questions = [
  "Do you find it hard to focus?",
  "Do you often forget daily tasks?",
  "Do you feel restless or fidgety?",
  "Do you get easily distracted?",
  "Do you procrastinate often?"
];

const Questionnaire = () => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answers.includes("")) {
      alert("Please answer all questions!");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div style={{ width: "50%", margin: "50px auto", padding: "20px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <h2>Self Assessment Questionnaire</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((q, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <p>{q}</p>
            <select value={answers[index]} onChange={(e) => handleChange(index, e.target.value)} required>
              <option value="">Select</option>
              <option value="Never">Never</option>
              <option value="Sometimes">Sometimes</option>
              <option value="Often">Often</option>
              <option value="Always">Always</option>
            </select>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
      {submitted && <SeverityChecker answers={answers} />}
    </div>
  );
};

export default Questionnaire;
