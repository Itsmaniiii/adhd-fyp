import React, { useState, useEffect } from "react";
import SeverityMeter from "../component/SeverityMeter";


export default function SeverityCheck() {
  const [score, setScore] = useState(5);
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

  // Mock data for different timeframes
  const timeframes = {
    week: [5, 7, 4, 6, 5, 8, 6],
    month: [5, 7, 4, 6, 5, 8, 6, 5, 7, 6, 5, 4, 6, 7, 5, 6, 4, 7, 6, 5, 4, 6, 7, 5, 6, 4, 7, 6, 5, 6],
    quarter: [5, 6, 5, 7, 6, 5, 4, 6, 7, 5, 6, 4]
  };

  useEffect(() => {
    setHistory(timeframes[selectedTimeframe]);
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
      timeframe: selectedTimeframe
    };
    console.log('Assessment saved:', assessment);
    alert('Assessment saved successfully!');
  };

  const getSeverityLevel = (score) => {
    if (score <= 3) return { level: "Mild", color: "#10b981", description: "Minimal impact on daily functioning" };
    if (score <= 6) return { level: "Moderate", color: "#f59e0b", description: "Noticeable impact, manageable with strategies" };
    return { level: "Severe", color: "#ef4444", description: "Significant impact, professional support recommended" };
  };

  const getAverageScore = () => {
    const sum = history.reduce((a, b) => a + b, 0);
    return (sum / history.length).toFixed(1);
  };

  const severity = getSeverityLevel(score);

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
            <span className="stat-value">{score}/10</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Average</span>
            <span className="stat-value">{getAverageScore()}/10</span>
          </div>
          <div className="stat-card severity-level" style={{ backgroundColor: `${severity.color}15` }}>
            <span className="stat-label">Level</span>
            <span className="stat-value" style={{ color: severity.color }}>
              {severity.level}
            </span>
          </div>
        </div>
      </div>

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
                  <p>Updating assessment...</p>
                </div>
              ) : (
                <>
                  <SeverityMeter score={score} onScoreChange={handleScoreChange} />
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
                  const severity = getSeverityLevel(value);
                  
                  return (
                    <div key={index} className="chart-bar-container">
                      <div className="chart-bar-tooltip">
                        Day {index + 1}: {value}/10
                      </div>
                      <div 
                        className="chart-bar" 
                        style={{
                          height: `${height}%`,
                          backgroundColor: severity.color
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
    </div>
  );
}