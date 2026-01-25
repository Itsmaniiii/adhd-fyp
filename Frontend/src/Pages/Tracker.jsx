import React, { useState } from "react";
import ProgressChart from "../component/ProgressChart";

const Tracker = () => {
  const [weeklyData, setWeeklyData] = useState([3, 4, 2, 5, 3, 4, 5]);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="tracker-page-container">
      <div className="tracker-wrapper">
        {/* Header Section */}
        <div className="tracker-header">
          <h1 className="tracker-title">Weekly Progress Tracker</h1>
          <p className="tracker-subtitle">Monitor your ADHD symptoms and track improvements over time</p>
        </div>

        {/* Main Content */}
        <div className="tracker-content">
          {/* Progress Chart Card */}
          <div className="tracker-card">
            <div className="card-header">
              <h2 className="card-title">This Week's Progress</h2>
              <div className="date-indicator">
                <svg className="date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Current Week
              </div>
            </div>
            
            <div className="chart-container">
              <ProgressChart labels={labels} dataPoints={weeklyData} />
            </div>

            <div className="tracker-stats">
              <div className="stat-card">
                <div className="stat-label">Weekly Average</div>
                <div className="stat-value">
                  {((weeklyData.reduce((a, b) => a + b, 0) / weeklyData.length) || 0).toFixed(1)}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Highest Day</div>
                <div className="stat-value">{Math.max(...weeklyData)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Lowest Day</div>
                <div className="stat-value">{Math.min(...weeklyData)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Improvement</div>
                <div className="stat-value trend-up">
                  {weeklyData[weeklyData.length - 1] > weeklyData[0] ? "+" : ""}
                  {weeklyData[weeklyData.length - 1] - weeklyData[0]} pts
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Cards */}
          <div className="tracker-sidebar">
            {/* Activity Log Card */}
            <div className="sidebar-card">
              <div className="card-header">
                <h3 className="card-title">Daily Log</h3>
              </div>
              <div className="activity-list">
                {labels.map((day, index) => (
                  <div key={day} className="activity-item">
                    <div className="activity-day">{day}</div>
                    <div className="activity-score">
                      <div 
                        className="score-bar" 
                        style={{ width: `${(weeklyData[index] / 5) * 100}%` }}
                      />
                      <span className="score-value">{weeklyData[index]}/5</span>
                    </div>
                    <div className="activity-status">
                      {weeklyData[index] >= 4 ? (
                        <span className="status-good">Good</span>
                      ) : weeklyData[index] >= 2.5 ? (
                        <span className="status-average">Average</span>
                      ) : (
                        <span className="status-poor">Poor</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips Card */}
            <div className="sidebar-card tips-card">
              <div className="card-header">
                <h3 className="card-title">Tips for Today</h3>
              </div>
              <div className="tips-list">
                <div className="tip-item">
                  <div className="tip-icon">💡</div>
                  <div className="tip-content">
                    <h4>Break tasks into smaller steps</h4>
                    <p>Divide large tasks into manageable chunks</p>
                  </div>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">⏰</div>
                  <div className="tip-content">
                    <h4>Use timers</h4>
                    <p>Try the Pomodoro technique: 25 min work, 5 min break</p>
                  </div>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">📝</div>
                  <div className="tip-content">
                    <h4>Daily journaling</h4>
                    <p>Note what worked well and what didn't</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="sidebar-card actions-card">
              <div className="card-header">
                <h3 className="card-title">Quick Actions</h3>
              </div>
              <div className="actions-list">
                <button className="action-btn">
                  <span className="action-icon">➕</span>
                  Add Today's Log
                </button>
                <button className="action-btn">
                  <span className="action-icon">📊</span>
                  View Detailed Report
                </button>
                <button className="action-btn">
                  <span className="action-icon">🎯</span>
                  Set Weekly Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracker;