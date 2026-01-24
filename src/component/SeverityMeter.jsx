import React from "react";

const SeverityChecker = ({ answers }) => {
  const calculateSeverity = () => {
    const score = answers.reduce((acc, curr) => {
      switch (curr) {
        case "Never": return acc + 0;
        case "Sometimes": return acc + 1;
        case "Often": return acc + 2;
        case "Always": return acc + 3;
        default: return acc;
      }
    }, 0);

    if (score <= 2) return "Low";
    if (score <= 5) return "Moderate";
    return "High";
  };

  if (!answers || answers.length === 0) return null;

  return (
    <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #4CAF50", borderRadius: "10px", backgroundColor: "#e8f5e9" }}>
      <h3>ADHD Severity Level: {calculateSeverity()}</h3>
      <p>{calculateSeverity() === "High" ? "You should consider consulting a professional." : "Keep tracking and improving."}</p>
    </div>
  );
};

export default SeverityChecker;
