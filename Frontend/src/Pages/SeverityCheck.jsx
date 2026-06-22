import React, { useState, useEffect } from "react";
import SeverityChecker from "../component/SeverityMeter";
import { useLocation } from "react-router-dom";
import api from "../api/axios";

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
  
  const [localScore, setLocalScore] = useState(0);
  const [aiConfidence, setAiConfidence] = useState(0);
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
    if (answers && Object.keys(answers).length > 0 && questions && questions.length > 0) {
      let totalScore = 0;
      let questionCount = 0;

      Object.values(answers).forEach((answer) => {
        if (answer && typeof answer === 'object' && answer.score !== undefined) {
          totalScore += answer.score;
          questionCount++;
        } else if (typeof answer === 'number') {
          totalScore += answer;
          questionCount++;
        }
      });

      if (questionCount > 0) {
        const maxPossible = questions.reduce((sum, q) => {
          if (!Array.isArray(q.options)) return sum;
          const optionScores = q.options.map((option) => option.score || 0);
          const maxOptionScore = optionScores.length > 0 ? Math.max(...optionScores) : 0;
          return sum + maxOptionScore;
        }, 0);

        if (maxPossible > 0) {
          // One consistent local score formula:
          // normalized = round((totalScore / maxPossible) * 10)
          const normalized = Math.max(
            0,
            Math.min(10, Math.round((totalScore / maxPossible) * 10))
          );
          setLocalScore(normalized);

          console.log(
            `📊 Local Score: ${normalized}/10 (${totalScore}/${maxPossible})`
          );
        }
      }
    }
  }, [answers, questions]);

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
          const response = await api.post('/predict/adhd', {
            answers: Object.values(answers)
          });
          
          console.log("📥 ML API Response:", response.data);
          
          if (response.data && response.data.success && response.data.prediction) {
            const predictionData = response.data.prediction;
            setMlResult({
              prediction: predictionData.severity || predictionData.prediction,
              probability: predictionData.confidence || 0,
              classIndex: predictionData.class_index ?? predictionData.classIndex
            });
            setAiConfidence(predictionData.confidence || 0);
            console.log("🤖 AI prediction updated:", predictionData.severity);
          } else {
            // Fallback uses local score only for label, without overwriting local score
            const fallbackLabel = localScore <= 3 ? "Low Risk" : localScore <= 6 ? "Moderate Risk" : "High Risk";
            setMlResult({
              prediction: fallbackLabel,
              probability: localScore / 10,
              classIndex: localScore <= 3 ? 0 : localScore <= 6 ? 1 : 2
            });
            setAiConfidence(localScore / 10);
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
  }, [answers]);

  // Handle direct prediction prop
  useEffect(() => {
    if (prediction) {
      console.log("🤖 Direct ML Prediction:", prediction);
      setMlResult(prediction);
      setAiConfidence(prediction.probability || 0);
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
      setLocalScore(newScore);
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
      localScore,
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
    const currentScore = scoreValue !== null ? scoreValue : localScore;
    
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

  const severity = getSeverityLevel(localScore);

  // ============================================
// ✅ ENHANCED LOADING STATE
// ============================================

if (!answers || Object.keys(answers).length === 0) {
  return (
    <div className="severity-check-page">
      {/* Header */}
      <div className="severity-header">
        <div className="header-content">
          <h1 className="page-title">ADHD Severity Assessment</h1>
          <p className="page-subtitle">Track your symptoms and monitor progress over time</p>
        </div>
      </div>
      
      {/* Enhanced Loading State */}
      <div className="loading-state">
        {/* Decorative Circles */}
        <div className="deco-circle deco-circle-1"></div>
        <div className="deco-circle deco-circle-2"></div>
        
        {/* Icon with Pulse */}
        <div className="loading-icon">📋</div>
        
        <h2>No Assessment Data Found</h2>
        <p className="subtitle">Let's get started with your assessment</p>
        <div className="divider"></div>
        
        <p>
          Please complete the questionnaire first to see your 
          <br />
          personalized severity assessment.
        </p>
        
        {/* Enhanced Button with Arrow */}
        <button 
          onClick={() => window.location.href = '/questionnaire'}
          className="btn-primary"
        >
          Go to Questionnaire
          <span className="btn-arrow">→</span>
        </button>
        
        {/* Loading Dots (Decorative) */}
        <div style={{ marginTop: "30px", opacity: 0.5 }}>
          <span style={{ fontSize: "12px", color: "#999" }}>Ready when you are</span>
          <div className="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
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
            <span className="stat-value" style={{ fontSize: "28px", fontWeight: "bold" }}>{localScore}/10</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Average</span>
            <span className="stat-value">{getAverageScore()}/10</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">AI Prediction</span>
            <span className="stat-value" style={{ fontSize: "18px", fontWeight: "bold", color: severity.color }}>
              {mlResult?.prediction || (localScore <= 3 ? "Low Risk" : localScore <= 6 ? "Moderate Risk" : "High Risk")}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Confidence</span>
            <span className="stat-value">
              {aiConfidence > 0 ? Math.round(aiConfidence * 100) + "%" : isLoading ? "Loading..." : "--"}
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
                    score={localScore} 
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
                      <label className="slider-label">Adjust Severity Score: <strong>{localScore}/10</strong></label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={localScore}
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

        {/* Sidebar with Recommendations, Notes, and History */}
        <div className="severity-sidebar">
          {/* Recommendations */}
          <div className="recommendations-card">
            <h2 className="card-title">Recommendations</h2>
            <div className="recommendations-list">
              {localScore <= 3 ? (
                <>
                  <div className="recommendation-item">
                    <span className="rec-icon">✅</span>
                    <span>Keep up your current routine and healthy habits.</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">📝</span>
                    <span>Continue regular tracking to monitor small changes.</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">🧠</span>
                    <span>Maintain good sleep, hydration, and focus-friendly habits.</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">📚</span>
                    <span>Set small daily goals to build consistency without overwhelm.</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">☀️</span>
                    <span>Spend time outdoors or in a calm environment to support attention.</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">🤝</span>
                    <span>Stay connected with supportive people who encourage healthy routines.</span>
                  </div>
                </>
              ) : localScore <= 6 ? (
                <>
                  <div className="recommendation-item">
                    <span className="rec-icon">🧘</span>
                    <span>Practice mindfulness or breathing exercises daily.</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">⏰</span>
                    <span>Use time-blocking and short task breaks to stay organized.</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">📱</span>
                    <span>Reduce distractions and set clear priorities each day.</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">🗂️</span>
                    <span>Break big tasks into small steps to reduce stress and confusion.</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">🎯</span>
                    <span>Use a checklist or planner to improve focus and follow-through.</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">😌</span>
                    <span>Try calming routines before work, study, or stressful activities.</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="recommendation-item">
                    <span className="rec-icon">👨‍⚕️</span>
                    <span>Consider speaking with a healthcare professional for support.</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">💊</span>
                    <span>Review symptoms and treatment options with your doctor.</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">🏃</span>
                    <span>Increase physical activity and maintain a consistent routine.</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">🛌</span>
                    <span>Prioritize sleep and rest, as fatigue can worsen symptoms.</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">🧑‍🏫</span>
                    <span>Ask for academic, work, or home support if daily tasks feel overwhelming.</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">📞</span>
                    <span>Reach out for counseling or structured support if needed.</span>
                  </div>
                </>
              )}
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

    </div>
  );
}