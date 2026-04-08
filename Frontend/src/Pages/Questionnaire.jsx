import React, { useState } from "react";
import SeverityCheck from '../Pages/SeverityCheck';

const Questionnaire = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [hoveredOption, setHoveredOption] = useState(null);

  const questions = [
  {
    id: 1,
    text: "What is your age?",
    type: "single",
    icon: "🎂",
    options: [
      { value: 6, label: "6-9 years", subtext: "Child", score: 0 },
      { value: 10, label: "10-12 years", subtext: "Pre-teen", score: 1 },
      { value: 13, label: "13-15 years", subtext: "Early Teen", score: 2 },
      { value: 16, label: "16-17 years", subtext: "Late Teen", score: 3 },
    ]
  },
  {
    id: 2,
    text: "What is your gender?",
    type: "single",
    icon: "👤",
    options: [
      { value: "M", label: "Male", subtext: "♂️", score: 1 },
      { value: "F", label: "Female", subtext: "♀️", score: 2 }
    ]
  },
  {
    id: 3,
    text: "Fails to give close attention to details or makes careless mistakes",
    type: "scale",
    icon: "🔍",
    options: [
      { value: 0, label: "Never", subtext: "Not at all", score: 0 },
      { value: 1, label: "Rarely", subtext: "Occasionally", score: 1 },
      { value: 2, label: "Sometimes", subtext: "Moderately often", score: 2 },
      { value: 3, label: "Often", subtext: "Very frequently", score: 3 }
    ]
  },
  {
    id: 4,
    text: "Difficulty sustaining attention in tasks or play",
    type: "scale",
    icon: "🎯",
    options: [
      { value: 0, label: "Never", subtext: "Not at all", score: 0 },
      { value: 1, label: "Rarely", subtext: "Occasionally", score: 1 },
      { value: 2, label: "Sometimes", subtext: "Moderately often", score: 2 },
      { value: 3, label: "Often", subtext: "Very frequently", score: 3 }
    ]
  },
  {
    id: 5,
    text: "Does not seem to listen when spoken to directly",
    type: "scale",
    icon: "👂",
    options: [
      { value: 0, label: "Never", subtext: "Not at all", score: 0 },
      { value: 1, label: "Rarely", subtext: "Occasionally", score: 1 },
      { value: 2, label: "Sometimes", subtext: "Moderately often", score: 2 },
      { value: 3, label: "Often", subtext: "Very frequently", score: 3 }
    ]
  },
  {
    id: 6,
    text: "Does not follow through on instructions / fails to finish tasks",
    type: "scale",
    icon: "📝",
    options: [
      { value: 0, label: "Never", subtext: "Not at all", score: 0 },
      { value: 1, label: "Rarely", subtext: "Occasionally", score: 1 },
      { value: 2, label: "Sometimes", subtext: "Moderately often", score: 2 },
      { value: 3, label: "Often", subtext: "Very frequently", score: 3 }
    ]
  },
  {
    id: 7,
    text: "Difficulty organizing tasks and activities",
    type: "scale",
    icon: "📋",
    options: [
      { value: 0, label: "Never", subtext: "Not at all", score: 0 },
      { value: 1, label: "Rarely", subtext: "Occasionally", score: 1 },
      { value: 2, label: "Sometimes", subtext: "Moderately often", score: 2 },
      { value: 3, label: "Often", subtext: "Very frequently", score: 3 }
    ]
  },
  {
    id: 8,
    text: "Avoids or dislikes tasks requiring sustained mental effort",
    type: "scale",
    icon: "🧠",
    options: [
      { value: 0, label: "Never", subtext: "Not at all", score: 0 },
      { value: 1, label: "Rarely", subtext: "Occasionally", score: 1 },
      { value: 2, label: "Sometimes", subtext: "Moderately often", score: 2 },
      { value: 3, label: "Often", subtext: "Very frequently", score: 3 }
    ]
  },
  {
    id: 9,
    text: "Loses things necessary for tasks",
    type: "scale",
    icon: "🔑",
    options: [
      { value: 0, label: "Never", subtext: "Not at all", score: 0 },
      { value: 1, label: "Rarely", subtext: "Occasionally", score: 1 },
      { value: 2, label: "Sometimes", subtext: "Moderately often", score: 2 },
      { value: 3, label: "Often", subtext: "Very frequently", score: 3 }
    ]
  },
  {
    id: 10,
    text: "Easily distracted by external stimuli",
    type: "scale",
    icon: "🎪",
    options: [
      { value: 0, label: "Never", subtext: "Not at all", score: 0 },
      { value: 1, label: "Rarely", subtext: "Occasionally", score: 1 },
      { value: 2, label: "Sometimes", subtext: "Moderately often", score: 2 },
      { value: 3, label: "Often", subtext: "Very frequently", score: 3 }
    ]
  },
  {
    id: 11,
    text: "Forgetful in daily activities",
    type: "scale",
    icon: "📅",
    options: [
      { value: 0, label: "Never", subtext: "Not at all", score: 0 },
      { value: 1, label: "Rarely", subtext: "Occasionally", score: 1 },
      { value: 2, label: "Sometimes", subtext: "Moderately often", score: 2 },
      { value: 3, label: "Often", subtext: "Very frequently", score: 3 }
    ]
  },
  {
    id: 12,
    text: "Fidgets or squirms in seat",
    type: "scale",
    icon: "💺",
    options: [
      { value: 0, label: "Never", subtext: "Not at all", score: 0 },
      { value: 1, label: "Rarely", subtext: "Occasionally", score: 1 },
      { value: 2, label: "Sometimes", subtext: "Moderately often", score: 2 },
      { value: 3, label: "Often", subtext: "Very frequently", score: 3 }
    ]
  },
  {
    id: 13,
    text: "Leaves seat when remaining seated is expected",
    type: "scale",
    icon: "🚶",
    options: [
      { value: 0, label: "Never", subtext: "Not at all", score: 0 },
      { value: 1, label: "Rarely", subtext: "Occasionally", score: 1 },
      { value: 2, label: "Sometimes", subtext: "Moderately often", score: 2 },
      { value: 3, label: "Often", subtext: "Very frequently", score: 3 }
    ]
  },
  {
    id: 14,
    text: "Runs or climbs excessively in inappropriate situations",
    type: "scale",
    icon: "🏃",
    options: [
      { value: 0, label: "Never", subtext: "Not at all", score: 0 },
      { value: 1, label: "Rarely", subtext: "Occasionally", score: 1 },
      { value: 2, label: "Sometimes", subtext: "Moderately often", score: 2 },
      { value: 3, label: "Often", subtext: "Very frequently", score: 3 }
    ]
  },
  {
    id: 15,
    text: "Unable to play or engage quietly",
    type: "scale",
    icon: "🎮",
    options: [
      { value: 0, label: "Never", subtext: "Not at all", score: 0 },
      { value: 1, label: "Rarely", subtext: "Occasionally", score: 1 },
      { value: 2, label: "Sometimes", subtext: "Moderately often", score: 2 },
      { value: 3, label: "Often", subtext: "Very frequently", score: 3 }
    ]
  },
  {
    id: 16,
    text: "'On the go' or acts driven by a motor",
    type: "scale",
    icon: "⚡",
    options: [
      { value: 0, label: "Never", subtext: "Not at all", score: 0 },
      { value: 1, label: "Rarely", subtext: "Occasionally", score: 1 },
      { value: 2, label: "Sometimes", subtext: "Moderately often", score: 2 },
      { value: 3, label: "Often", subtext: "Very frequently", score: 3 }
    ]
  },
  {
    id: 17,
    text: "Talks excessively",
    type: "scale",
    icon: "💬",
    options: [
      { value: 0, label: "Never", subtext: "Not at all", score: 0 },
      { value: 1, label: "Rarely", subtext: "Occasionally", score: 1 },
      { value: 2, label: "Sometimes", subtext: "Moderately often", score: 2 },
      { value: 3, label: "Often", subtext: "Very frequently", score: 3 }
    ]
  },
  {
    id: 18,
    text: "Blurts out answers prematurely",
    type: "scale",
    icon: "🗣️",
    options: [
      { value: 0, label: "Never", subtext: "Not at all", score: 0 },
      { value: 1, label: "Rarely", subtext: "Occasionally", score: 1 },
      { value: 2, label: "Sometimes", subtext: "Moderately often", score: 2 },
      { value: 3, label: "Often", subtext: "Very frequently", score: 3 }
    ]
  },
  {
    id: 19,
    text: "Difficulty waiting turn",
    type: "scale",
    icon: "⏳",
    options: [
      { value: 0, label: "Never", subtext: "Not at all", score: 0 },
      { value: 1, label: "Rarely", subtext: "Occasionally", score: 1 },
      { value: 2, label: "Sometimes", subtext: "Moderately often", score: 2 },
      { value: 3, label: "Often", subtext: "Very frequently", score: 3 }
    ]
  },
  {
    id: 20,
    text: "Interrupts or intrudes on others",
    type: "scale",
    icon: "🚫",
    options: [
      { value: 0, label: "Never", subtext: "Not at all", score: 0 },
      { value: 1, label: "Rarely", subtext: "Occasionally", score: 1 },
      { value: 2, label: "Sometimes", subtext: "Moderately often", score: 2 },
      { value: 3, label: "Often", subtext: "Very frequently", score: 3 }
    ]
  }
];
  const handleAnswer = (questionId, value, score) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { value, score }
    }));
  };

  const handleNext = () => {
    if (!answers[questions[currentQuestion].id]) {
      alert("Please answer the current question before proceeding!");
      return;
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const allAnswered = questions.every(q => answers[q.id]);
    
    if (!allAnswered) {
      alert("Please answer all questions before submitting!");
      return;
    }
    
    setSubmitted(true);
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (submitted) {
    return <SeverityCheck answers={answers} questions={questions} />;
  }

  return (
    <div style={styles.container}>
      {/* Header with gradient */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>🧠</div>
        <h1 style={styles.title}>ADHD Self Assessment</h1>
        <p style={styles.subtitle}>Based on DSM-5 ADHD diagnostic criteria</p>
      </div>

      {/* Progress Section */}
      <div style={styles.progressSection}>
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>Assessment Progress</span>
          <span style={styles.progressPercent}>{Math.round(progress)}%</span>
        </div>
        <div style={styles.progressBar}>
          <div style={{...styles.progressFill, width: `${progress}%`}} />
        </div>
        <p style={styles.questionCounter}>
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      {/* Question Card */}
      <div style={styles.questionCard}>
        <div style={styles.questionHeader}>
          <span style={styles.questionIcon}>{currentQ.icon}</span>
          <span style={styles.questionNumber}>Question {currentQ.id}</span>
        </div>
        
        <h2 style={styles.questionText}>{currentQ.text}</h2>
        
        <div style={styles.optionsGrid}>
          {currentQ.options.map((option, idx) => (
            <label 
              key={idx} 
              style={{
                ...styles.optionCard,
                ...(answers[currentQ.id]?.value === option.value && styles.optionCardSelected),
                ...(hoveredOption === option.value && styles.optionCardHover)
              }}
              onMouseEnter={() => setHoveredOption(option.value)}
              onMouseLeave={() => setHoveredOption(null)}
            >
              <input
                type="radio"
                name={`question-${currentQ.id}`}
                value={option.value}
                checked={answers[currentQ.id]?.value === option.value}
                onChange={() => handleAnswer(currentQ.id, option.value, option.score)}
                style={styles.radio}
              />
              <div style={styles.optionContent}>
                <div style={styles.optionLabel}>{option.label}</div>
                {option.subtext && (
                  <div style={styles.optionSubtext}>{option.subtext}</div>
                )}
              </div>
              {answers[currentQ.id]?.value === option.value && (
                <div style={styles.checkMark}>✓</div>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={styles.buttonContainer}>
        <button 
          onClick={handlePrevious} 
          disabled={currentQuestion === 0}
          style={{
            ...styles.button,
            ...styles.buttonSecondary,
            ...(currentQuestion === 0 && styles.buttonDisabled)
          }}
        >
          ← Previous
        </button>
        
        {currentQuestion < questions.length - 1 ? (
          <button onClick={handleNext} style={{...styles.button, ...styles.buttonPrimary}}>
            Next Question →
          </button>
        ) : (
          <button onClick={handleSubmit} style={{...styles.button, ...styles.buttonSubmit}}>
            Submit Assessment ✓
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '40px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '20px',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  },
  headerIcon: {
    fontSize: '48px',
    marginBottom: '10px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 10px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: 0
  },
  progressSection: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '25px'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px'
  },
  progressLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#667eea'
  },
  progressPercent: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#764ba2'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '10px'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    transition: 'width 0.3s ease',
    borderRadius: '4px'
  },
  questionCounter: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#999',
    margin: 0
  },
  questionCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    marginBottom: '25px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
  },
  questionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f0f0f0'
  },
  questionIcon: {
    fontSize: '28px'
  },
  questionNumber: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#667eea',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  questionText: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '30px',
    lineHeight: 1.3
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '12px'
  },
  optionCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '2px solid transparent',
    position: 'relative'
  },
  optionCardSelected: {
    backgroundColor: '#e8eaf6',
    borderColor: '#667eea',
    boxShadow: '0 2px 8px rgba(102,126,234,0.2)'
  },
  optionCardHover: {
    transform: 'translateX(5px)',
    backgroundColor: '#f0f0f0'
  },
  radio: {
    marginRight: '15px',
    cursor: 'pointer',
    width: '20px',
    height: '20px',
    accentColor: '#667eea'
  },
  optionContent: {
    flex: 1
  },
  optionLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '4px'
  },
  optionSubtext: {
    fontSize: '12px',
    color: '#999'
  },
  checkMark: {
    width: '24px',
    height: '24px',
    backgroundColor: '#667eea',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'space-between'
  },
  button: {
    flex: 1,
    padding: '14px 28px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  buttonPrimary: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
  },
  buttonSecondary: {
    backgroundColor: '#6c757d',
    color: 'white'
  },
  buttonSubmit: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(76,175,80,0.4)'
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
};

export default Questionnaire;