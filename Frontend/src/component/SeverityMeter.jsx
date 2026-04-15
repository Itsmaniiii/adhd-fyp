import React from "react";

const SeverityChecker = ({ answers, questions }) => {
  const calculateSeverity = () => {
    if (!answers || !questions) return { level: "Unknown", score: 0, description: "No data available" };

    // Calculate total score from questionnaire answers
    const totalScore = Object.values(answers).reduce((sum, answer) => {
      return sum + (answer.score || 0);
    }, 0);

    // Convert to 1-10 scale for severity meter
    const normalizedScore = Math.min(Math.max(Math.round((totalScore / 60) * 10), 1), 10);

    // Determine severity level based on total score
    let level, color, description;
    if (totalScore <= 15) {
      level = "Low Risk";
      color = "#10b981"; // green
      description = "Minimal ADHD indicators. Maintain healthy lifestyle habits.";
    } else if (totalScore <= 30) {
      level = "Moderate Risk";
      color = "#f59e0b"; // orange
      description = "Some ADHD indicators present. Consider lifestyle improvements.";
    } else if (totalScore <= 45) {
      level = "High Risk";
      color = "#ef4444"; // red
      description = "Multiple ADHD indicators. Professional consultation recommended.";
    } else {
      level = "Very High Risk";
      color = "#dc2626"; // dark red
      description = "Strong ADHD indicators. Seek professional help immediately.";
    }

    return {
      level,
      score: normalizedScore,
      totalScore,
      color,
      description
    };
  };

  const severity = calculateSeverity();

  return (
    <div style={{
      marginTop: "20px",
      padding: "20px",
      border: `2px solid ${severity.color}`,
      borderRadius: "15px",
      backgroundColor: `${severity.color}10`,
      textAlign: "center"
    }}>
      <h3 style={{ color: severity.color, marginBottom: "10px" }}>
        ADHD Risk Assessment: {severity.level}
      </h3>
      <div style={{ fontSize: "24px", fontWeight: "bold", color: severity.color, marginBottom: "10px" }}>
        Score: {severity.score}/10 (Total: {severity.totalScore})
      </div>
      <p style={{ color: "#666", fontSize: "14px" }}>{severity.description}</p>

      {answers && questions && (
        <div style={{ marginTop: "15px", textAlign: "left" }}>
          <h4>Your Responses Summary:</h4>
          {questions.map((q, index) => {
            const userAnswer = answers[q.id];
            if (!userAnswer) return null;

            const selectedOption = q.options.find(opt => opt.value === userAnswer.value);
            return (
              <div key={q.id} style={{ marginBottom: "8px", fontSize: "12px" }}>
                <strong>Q{index + 1}:</strong> {selectedOption?.label || userAnswer.value}
                <span style={{ color: severity.color, marginLeft: "8px" }}>
                  (Score: {userAnswer.score})
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SeverityChecker;
