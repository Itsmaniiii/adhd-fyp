import React from "react";

const SeverityChecker = ({ answers, questions, mlResult, score: propScore }) => {
  const calculateSeverity = () => {
    if (!answers || !questions) {
      return { level: "Unknown", score: 0, totalScore: 0, color: "#999", description: "No data available" };
    }

    // Calculate total score from questionnaire answers
    let totalScore = 0;
    let maxPossible = 0;
    
    Object.values(answers).forEach(answer => {
      if (answer && answer.score !== undefined) {
        totalScore += answer.score;
        maxPossible += 3;
      }
    });

    // Use the parent-calculated local score only.
    // The local score should be based on one formula:
    // round((totalScore / maxPossible) * 10)
    let normalizedScore = Number.isFinite(propScore) ? propScore : 0;
    normalizedScore = Math.max(0, Math.min(10, normalizedScore));

    // Determine severity level
    let level, color, description;
    const percentage = maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0;
    
    if (percentage <= 25) {
      level = "Low Risk";
      color = "#10b981";
      description = "Minimal ADHD indicators. Maintain healthy lifestyle habits.";
    } else if (percentage <= 50) {
      level = "Moderate Risk";
      color = "#f59e0b";
      description = "Some ADHD indicators present. Consider lifestyle improvements.";
    } else if (percentage <= 75) {
      level = "High Risk";
      color = "#ef4444";
      description = "Multiple ADHD indicators. Professional consultation recommended.";
    } else {
      level = "Very High Risk";
      color = "#dc2626";
      description = "Strong ADHD indicators. Seek professional help immediately.";
    }

    return {
      level,
      score: normalizedScore || 0,
      totalScore,
      maxPossible,
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
      
      <div style={{ fontSize: "48px", fontWeight: "bold", color: severity.color, marginBottom: "10px" }}>
        {severity.score}/10
      </div>
      
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "15px" }}>
        {severity.description}
      </p>

      {/* ML Result Display */}
      {mlResult && mlResult.probability && (
        <div style={{
          marginTop: "10px",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px"
        }}>
          <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
            🤖 AI Model Confidence
          </div>
          <div style={{
            width: "100%",
            height: "8px",
            backgroundColor: "#e0e0e0",
            borderRadius: "4px",
            overflow: "hidden"
          }}>
            <div style={{
              width: `${(mlResult.probability || 0) * 100}%`,
              height: "100%",
              backgroundColor: severity.color,
              transition: "width 0.3s ease"
            }} />
          </div>
          <div style={{ fontSize: "14px", fontWeight: "bold", marginTop: "5px", color: severity.color }}>
            {Math.round((mlResult.probability || 0) * 100)}% Confidence
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
            Prediction: {mlResult.prediction || "Loading..."}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeverityChecker;