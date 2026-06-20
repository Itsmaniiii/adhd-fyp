import React, { useState, useEffect } from "react";
import SeverityChecker from "../component/SeverityMeter";
import { useLocation } from "react-router-dom";
import axios from "axios";

const TIMEFRAMES_DATA = {
  week: [5, 7, 4, 6, 5, 8, 6],
  month: [5, 7, 4, 6, 5, 8, 6, 5, 7, 6, 5, 4, 6, 7, 5, 6, 4, 7, 6, 5, 4, 6, 7, 5, 6, 4, 7, 6, 5, 6],
  quarter: [5, 6, 5, 7, 6, 5, 4, 6, 7, 5, 6, 4]
};

export default function SeverityCheck(props) {
  const location = useLocation();
  
  // Receive data from props (from Questionnaire) OR location.state (from navigation)
  const { answers: locationAnswers, questions: locationQuestions, prediction } = location.state || {};
  const answers = props.answers || locationAnswers;
  const questions = props.questions || locationQuestions;
  
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([5, 7, 4, 6, 5, 8]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [notes, setNotes] = useState("");
  const [symptoms, setSymptoms] = useState({
    focus: 3,
    impulsivity: 4,
    organization: 2,
    emotional: 5,
    hyperactivity: 3
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mlResult, setMlResult] = useState(null);
  const [apiError, setApiError] = useState(null);

  // DEBUG: Check if data received
  useEffect(() => {
    console.log("========== SEVERITY CHECK DEBUG ==========");
    console.log("Props answers:", props.answers);
    console.log("Location answers:", locationAnswers);
    console.log("Final answers:", answers);
    console.log("Questions:", questions);
    console.log("Answers count:", answers ? Object.keys(answers).length : 0);
    console.log("==========================================");
  }, []);

  // Calculate score from answers (local calculation)
  useEffect(() => {
    if (answers && Object.keys(answers).length > 0) {
      let totalScore = 0;
      let questionCount = 0;
      
      Object.values(answers).forEach(answer => {
        if (answer && typeof answer === 'object' && answer.score !== undefined) {
          totalScore += answer.score;
          questionCount++;
        } else if (typeof answer === 'number') {
          totalScore += answer;
          questionCount++;
        }
      });
      
      if (questionCount > 0) {
        const maxPossible = questionCount * 3;
        const normalized = Math.round((totalScore / maxPossible) * 10);
        setScore(normalized);
        console.log(`📊 Local Score: ${normalized}/10 (${totalScore}/${maxPossible})`);
      }
    }
  }, [answers]);

  // Call ML API for prediction
  useEffect(() => {
    const callMLAPI = async () => {
      if (answers && Object.keys(answers).length > 0) {
        setIsLoading(true);
        setApiError(null);
        
        // Extract features from answers
        const features = [];
        Object.values(answers).forEach(answer => {
          if (answer && typeof answer === 'object' && answer.score !== undefined) {
            features.push(answer.score);
          } else if (typeof answer === 'number') {
            features.push(answer);
          }
        });
        
        console.log("📤 Sending to ML API - Features:", features);
        
        try {
          const response = await axios.post('http://127.0.0.1:5001/predict', {
            features: features
          });
          
          console.log("📥 ML API Response:", response.data);
          
          if (response.data && response.data.success) {
            setMlResult({
              prediction: response.data.severity,
              probability: response.data.confidence,
              classIndex: response.data.class_index
            });
            // Update score with ML confidence
            const mlScore = Math.round(response.data.confidence * 10);
            setScore(mlScore);
            console.log("🤖 ML Score:", mlScore);
          } else {
            // Fallback - use local score
            setMlResult({
              prediction: score <= 3 ? "Low Risk" : score <= 6 ? "Moderate Risk" : "High Risk",
              probability: score / 10,
              classIndex: score <= 3 ? 0 : score <= 6 ? 1 : 2
            });
            console.log("📊 Using fallback prediction");
          }
        } catch (error) {
          console.error("❌ ML API Error:", error);
          setApiError("ML model not available. Using local scoring.");
          // Fallback prediction based on score
          setMlResult(null);
        }
        
        setIsLoading(false);
      }
    };
    
    callMLAPI();
  }, [answers, score]);

  // Handle direct prediction prop
  useEffect(() => {
    if (prediction) {
      console.log("🤖 Direct ML Prediction:", prediction);
      setMlResult(prediction);
      const probabilityScore = Math.round((prediction.probability || 0) * 10);
      setScore(probabilityScore);
    }
  }, [prediction]);

  // Update symptoms from answers
  useEffect(() => {
    if (answers && questions) {
      const categoryMap = {
        focus: "Inattention",
        hyperactivity: "Hyperactivity",
        impulsivity: "Impulsivity",
        emotional: "Impairment",
        organization: "Inattention"
      };

      setSymptoms(prev => {
        const newSymptoms = { ...prev };
        Object.keys(categoryMap).forEach(symptomKey => {
          const sectionName = categoryMap[symptomKey];
          const sectionQuestions = questions.filter(q => q.section === sectionName);
          const sectionScores = sectionQuestions.map(q => answers[q.id]?.score || 0);

          if (sectionScores.length > 0) {
            const totalObtained = sectionScores.reduce((a, b) => a + b, 0);
            const maxPossible = sectionQuestions.length * 3;
            newSymptoms[symptomKey] = Math.round((totalObtained / maxPossible) * 10);
          }
        });
        return newSymptoms;
      });
    }
  }, [answers, questions]);

  // Update history when timeframe changes
  useEffect(() => {
    setHistory(TIMEFRAMES_DATA[selectedTimeframe]);
  }, [selectedTimeframe]);

  const handleScoreChange = (newScore) => {
    setIsLoading(true);
    setTimeout(() => {
      setScore(newScore);
      setHistory(prev => [...prev.slice(-19), newScore]);
      setIsLoading(false);
    }, 500);
  };

  const handleSymptomChange = (symptom, value) => {
    setSymptoms(prev => ({
      ...prev,
      [symptom]: value
    }));
  };

  const handleSaveAssessment = () => {
    const assessment = {
      date: new Date().toISOString(),
      score,
      symptoms: { ...symptoms },
      notes,
      timeframe: selectedTimeframe,
      mlResult: mlResult
    };
    console.log('Assessment saved:', assessment);
    
    // Save to localStorage
    const savedAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
    savedAssessments.push(assessment);
    localStorage.setItem('assessments', JSON.stringify(savedAssessments));
    
    alert('✅ Assessment saved successfully!');
  };

  const getSeverityLevel = (scoreValue = null) => {
    const currentScore = scoreValue !== null ? scoreValue : score;
    
    if (isLoading && !mlResult) {
      return { level: "Analyzing...", color: "#999", description: "Loading AI prediction..." };
    }
    
    if (currentScore <= 3) {
      return { level: "Low Risk", color: "#10b981", description: "Mild symptoms - continue healthy habits" };
    } else if (currentScore <= 6) {
      return { level: "Moderate Risk", color: "#f59e0b", description: "Moderate symptoms - monitor regularly" };
    } else {
      return { level: "High Risk", color: "#ef4444", description: "Severe symptoms - consult specialist" };
    }
  };

  const getAverageScore = () => {
    if (!history.length) return "0";
    const sum = history.reduce((a, b) => a + b, 0);
    return (sum / history.length).toFixed(1);
  };

  const severity = getSeverityLevel();

  // Show loading if no answers
  if (!answers || Object.keys(answers).length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading assessment data...</h2>
        <p>Please complete the questionnaire first.</p>
        <button 
          onClick={() => window.location.href = '/questionnaire'}
          style={{ padding: "10px 20px", background: "#667eea", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "20px" }}
        >
          Go to Questionnaire
        </button>
      </div>
    );
  }

  return (
    <div className="severity-check-page">
      {/* Header Section */}
      <div className="severity-header">
        <div className="header-content">
          <h1 className="page-title">ADHD Severity Assessment</h1>
          <p className="page-subtitle">
            Track your symptoms and monitor progress over time
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-label">Current Score</span>
            <span className="stat-value" style={{ fontSize: "28px", fontWeight: "bold" }}>{score}/10</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Average</span>
            <span className="stat-value">{getAverageScore()}/10</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">AI Prediction</span>
            <span className="stat-value" style={{ fontSize: "18px", fontWeight: "bold", color: severity.color }}>
              {mlResult?.prediction || (score <= 3 ? "Low Risk" : score <= 6 ? "Moderate Risk" : "High Risk")}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Confidence</span>
            <span className="stat-value">
              {mlResult?.probability ? Math.round(mlResult.probability * 100) + "%" : isLoading ? "Loading..." : "--"}
            </span>
          </div>
          <div className="stat-card severity-level" style={{ backgroundColor: `${severity.color}15` }}>
            <span className="stat-label">Level</span>
            <span className="stat-value" style={{ color: severity.color, fontWeight: "bold" }}>
              {severity.level}
            </span>
          </div>
        </div>
      </div>

      {/* API Error Message */}
      {apiError && (
        <div style={{ 
          backgroundColor: "#fff3cd", 
          color: "#856404", 
          padding: "10px", 
          margin: "10px 20px", 
          borderRadius: "5px", 
          textAlign: "center" 
        }}>
          ⚠️ {apiError}
        </div>
      )}

      <div className="severity-content">
        {/* Main Severity Meter */}
        <div className="severity-main-section">
          <div className="severity-card">
            <div className="card-header">
              <h2 className="card-title">Today's Assessment</h2>
              <div className="date-indicator">
                <span className="date-icon">📅</span>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            
            <div className="severity-meter-container">
              {isLoading ? (
                <div className="loading-overlay">
                  <div className="spinner"></div>
                  <p>Analyzing with AI...</p>
                </div>
              ) : (
                <>
                  <SeverityChecker 
                    answers={answers} 
                    questions={questions} 
                    mlResult={mlResult} 
                    score={score} 
                  />
                  <div className="severity-info">
                    <div className="severity-level-display" style={{ color: severity.color }}>
                      <span className="level-icon">📊</span>
                      <div>
                        <h3>{severity.level} Severity</h3>
                        <p>{severity.description}</p>
                      </div>
                    </div>
                    <div className="score-slider">
                      <label className="slider-label">Adjust Severity Score: <strong>{score}/10</strong></label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={score}
                        onChange={(e) => handleScoreChange(parseInt(e.target.value))}
                        className="score-range"
                      />
                      <div className="slider-ticks">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(tick => (
                          <span key={tick} className="tick">{tick}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Symptoms Breakdown */}
          <div className="symptoms-card">
            <h2 className="card-title">Symptom Breakdown</h2>
            <p className="card-subtitle">Rate each symptom on a scale of 1-10</p>
            
            <div className="symptoms-list">
              {Object.entries(symptoms).map(([key, value]) => (
                <div key={key} className="symptom-item">
                  <div className="symptom-header">
                    <span className="symptom-name">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                    <span className="symptom-score">{value}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={(e) => handleSymptomChange(key, parseInt(e.target.value))}
                    className="symptom-slider"
                  />
                  <div className="symptom-ticks">
                    <span className="tick-label">Mild</span>
                    <span className="tick-label">Moderate</span>
                    <span className="tick-label">Severe</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar with History and Notes */}
        <div className="severity-sidebar">
          {/* History Chart */}
          <div className="history-card">
            <div className="card-header">
              <h2 className="card-title">Progress History</h2>
              <div className="timeframe-selector">
                {['week', 'month', 'quarter'].map(timeframe => (
                  <button
                    key={timeframe}
                    className={`timeframe-btn ${selectedTimeframe === timeframe ? 'active' : ''}`}
                    onClick={() => setSelectedTimeframe(timeframe)}
                  >
                    {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="history-chart">
              <div className="chart-container">
                {history.map((value, index) => {
                  const maxScore = Math.max(...history);
                  const height = (value / maxScore) * 100;
                  const severityInfo = getSeverityLevel(value);
                  
                  return (
                    <div key={index} className="chart-bar-container">
                      <div className="chart-bar-tooltip">
                        Day {index + 1}: {value}/10
                      </div>
                      <div 
                        className="chart-bar" 
                        style={{
                          height: `${height}%`,
                          backgroundColor: severityInfo.color
                        }}
                      />
                      <span className="chart-label">{index + 1}</span>
                    </div>
                  );
                })}
              </div>
              <div className="chart-axis">
                <span className="axis-label">Low</span>
                <span className="axis-label">Severity</span>
                <span className="axis-label">High</span>
              </div>
            </div>
            
            <div className="history-stats">
              <div className="history-stat">
                <span className="stat-label">Best Score</span>
                <span className="stat-value">{Math.min(...history)}/10</span>
              </div>
              <div className="history-stat">
                <span className="stat-label">Worst Score</span>
                <span className="stat-value">{Math.max(...history)}/10</span>
              </div>
              <div className="history-stat">
                <span className="stat-label">Trend</span>
                <span className="stat-value trend-up">↗ Improving</span>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="notes-card">
            <h2 className="card-title">Assessment Notes</h2>
            <p className="card-subtitle">Add context about today's assessment</p>
            
            <textarea
              className="notes-textarea"
              placeholder="Describe factors affecting today's score (sleep, stress, medication, etc.)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
            />
            
            <div className="notes-footer">
              <button 
                className="save-btn"
                onClick={handleSaveAssessment}
                disabled={isLoading}
              >
                <span className="btn-icon">💾</span>
                Save Assessment
              </button>
              <div className="char-count">
                {notes.length}/500 characters
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="recommendations-card">
            <h2 className="card-title">Recommendations</h2>
            <div className="recommendations-list">
              {score <= 3 ? (
                <>
                  <div className="recommendation-item">
                    <span className="rec-icon">✅</span>
                    <span>Continue current strategies</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">📝</span>
                    <span>Maintain regular tracking</span>
                  </div>
                </>
              ) : score <= 6 ? (
                <>
                  <div className="recommendation-item">
                    <span className="rec-icon">🧘</span>
                    <span>Practice mindfulness exercises</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">⏰</span>
                    <span>Use time-blocking techniques</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">📱</span>
                    <span>Limit digital distractions</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="recommendation-item">
                    <span className="rec-icon">👨‍⚕️</span>
                    <span>Consider professional consultation</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">💊</span>
                    <span>Review medication with doctor</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">🏃</span>
                    <span>Increase physical activity</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="severity-footer">
        <button className="action-btn secondary">
          <span className="btn-icon">📥</span>
          Export Report
        </button>
        <button className="action-btn secondary">
          <span className="btn-icon">🔄</span>
          Compare with Last Week
        </button>
        <button className="action-btn primary">
          <span className="btn-icon">📋</span>
          Schedule Next Assessment
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        .loading-overlay {
          text-align: center;
          padding: 40px;
        }
        .stat-card {
          background: white;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }
        .stat-label {
          font-size: 12px;
          color: #666;
          display: block;
        }
        .stat-value {
          font-size: 20px;
          font-weight: bold;
          color: #667eea;
        }
        .header-stats {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 15px;
          margin: 20px;
        }
        .severity-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          padding: 20px;
        }
        .severity-main-section, .severity-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .severity-card, .symptoms-card, .history-card, .notes-card, .recommendations-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .card-title {
          margin: 0;
          font-size: 18px;
        }
        .timeframe-selector {
          display: flex;
          gap: 5px;
        }
        .timeframe-btn {
          padding: 5px 10px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 5px;
          cursor: pointer;
        }
        .timeframe-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }
        .chart-container {
          display: flex;
          align-items: flex-end;
          height: 150px;
          gap: 4px;
        }
        .chart-bar-container {
          flex: 1;
          text-align: center;
        }
        .chart-bar {
          width: 100%;
          transition: height 0.3s ease;
          border-radius: 3px 3px 0 0;
          cursor: pointer;
        }
        .chart-label {
          font-size: 9px;
          margin-top: 5px;
          display: block;
        }
        .history-stats {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
        }
        .symptom-item {
          margin-bottom: 20px;
        }
        .symptom-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .symptom-name {
          font-weight: bold;
          text-transform: capitalize;
        }
        .symptom-score {
          color: #667eea;
          font-weight: bold;
        }
        input[type="range"] {
          width: 100%;
        }
        .notes-textarea {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ddd;
          margin-bottom: 10px;
        }
        .notes-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .save-btn {
          padding: 8px 16px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .recommendation-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .severity-footer {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          padding: 15px;
          border-top: 1px solid #ddd;
          margin-top: 20px;
        }
        .action-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .action-btn.secondary {
          background: #6c757d;
          color: white;
        }
        .action-btn.primary {
          background: #667eea;
          color: white;
        }
        @media (max-width: 768px) {
          .severity-content {
            grid-template-columns: 1fr;
          }
          .header-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}