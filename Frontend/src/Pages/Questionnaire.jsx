import React, { useState } from "react";
import SeverityCheck from '../Pages/SeverityCheck';

const Questionnaire = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [hoveredOption, setHoveredOption] = useState(null);

  // Questions based on ADHD dataset
  const questions = [
    {
      id: 1,
      text: "What is your age?",
      type: "single",
      icon: "🎂",
      options: [
        { value: "3-5", label: "3-5 years", subtext: "Child", score: 0 },
        { value: "6-12", label: "6-12 years", subtext: "Primary School", score: 1 },
        { value: "13-17", label: "13-17 years", subtext: "Teenager", score: 2 },
        { value: "18-25", label: "18-25 years", subtext: "Young Adult", score: 3 },
        { value: "26-40", label: "26-40 years", subtext: "Adult", score: 2 },
        { value: "41+", label: "41+ years", subtext: "Mature Adult", score: 1 }
      ]
    },
    {
      id: 2,
      text: "What is your gender?",
      type: "single",
      icon: "👤",
      options: [
        { value: "male", label: "Male", subtext: "♂️", score: 1 },
        { value: "female", label: "Female", subtext: "♀️", score: 2 }
      ]
    },
    {
      id: 3,
      text: "What is your educational level?",
      type: "single",
      icon: "🎓",
      options: [
        { value: "kindergarten", label: "Kindergarten", subtext: "Early education", score: 0 },
        { value: "primary", label: "Primary School", subtext: "Grades 1-5", score: 1 },
        { value: "middle", label: "Middle School", subtext: "Grades 6-8", score: 2 },
        { value: "secondary", label: "Secondary School", subtext: "Grades 9-12", score: 3 },
        { value: "university", label: "University", subtext: "Higher education", score: 4 },
        { value: "working", label: "Working Professional", subtext: "Employed", score: 5 },
        { value: "not_working", label: "Not Working", subtext: "Seeking opportunities", score: 6 }
      ]
    },
    {
      id: 4,
      text: "Do you have a family history of ADHD or mental health conditions?",
      type: "single",
      icon: "👨‍👩‍👧",
      options: [
        { value: "yes", label: "Yes", subtext: "Family history present", score: 1 },
        { value: "no", label: "No", subtext: "No family history", score: 0 },
        { value: "unknown", label: "Unknown", subtext: "Not sure", score: 0 }
      ]
    },
    {
      id: 5,
      text: "How many hours do you sleep on average per night?",
      type: "single",
      icon: "😴",
      options: [
        { value: "7-9", label: "7-9 hours", subtext: "Optimal sleep", score: 0 },
        { value: "9-11", label: "9-11 hours", subtext: "Extended sleep", score: 1 },
        { value: "5-7", label: "5-7 hours", subtext: "Reduced sleep", score: 2 },
        { value: "less_5", label: "Less than 5 hours", subtext: "Severe sleep deprivation", score: 3 },
        { value: "more_11", label: "More than 11 hours", subtext: "Excessive sleep", score: 2 }
      ]
    },
    {
      id: 6,
      text: "How many hours do you spend on daily activities?",
      type: "single",
      icon: "🏃",
      options: [
        { value: "0-3", label: "0-3 hours", subtext: "Very Low activity", score: 3 },
        { value: "4-6", label: "4-6 hours", subtext: "Low activity", score: 2 },
        { value: "7-9", label: "7-9 hours", subtext: "Moderate activity", score: 1 },
        { value: "10-12", label: "10-12 hours", subtext: "High activity", score: 0 }
      ]
    },
    {
      id: 7,
      text: "How many hours do you use phone daily?",
      type: "single",
      icon: "📱",
      options: [
        { value: "0-2", label: "0-2 hours", subtext: "Minimal use", score: 0 },
        { value: "3-4", label: "3-4 hours", subtext: "Moderate use", score: 1 },
        { value: "5-6", label: "5-6 hours", subtext: "High use", score: 2 },
        { value: "7-8", label: "7-8 hours", subtext: "Very high use", score: 3 },
        { value: "9+", label: "9+ hours", subtext: "Excessive use", score: 4 }
      ]
    },
    {
      id: 8,
      text: "How many hours do you walk/run daily?",
      type: "single",
      icon: "🚶",
      options: [
        { value: "0-0.5", label: "0-0.5 hours", subtext: "Sedentary", score: 3 },
        { value: "0.6-1", label: "0.6-1 hour", subtext: "Low activity", score: 2 },
        { value: "1.1-1.5", label: "1.1-1.5 hours", subtext: "Moderate activity", score: 1 },
        { value: "1.6+", label: "1.6+ hours", subtext: "Active lifestyle", score: 0 }
      ]
    },
    {
      id: 9,
      text: "Do you have difficulty organizing tasks?",
      type: "single",
      icon: "📋",
      options: [
        { value: "no", label: "No", subtext: "Well organized", score: 0 },
        { value: "yes", label: "Yes", subtext: "Significant difficulty", score: 1 }
      ]
    },
    {
      id: 10,
      text: "How is your focus score while watching videos?",
      type: "single",
      icon: "🎯",
      options: [
        { value: "8-10", label: "8-10", subtext: "Excellent focus", score: 0 },
        { value: "5-7", label: "5-7", subtext: "Good focus", score: 1 },
        { value: "3-4", label: "3-4", subtext: "Poor focus", score: 2 },
        { value: "0-2", label: "0-2", subtext: "Very poor focus", score: 3 }
      ]
    },
    {
      id: 11,
      text: "How many cups of coffee/tea do you consume daily?",
      type: "single",
      icon: "☕",
      options: [
        { value: "0", label: "0 cups", subtext: "No caffeine", score: 0 },
        { value: "1-2", label: "1-2 cups", subtext: "Low caffeine", score: 1 },
        { value: "3-4", label: "3-4 cups", subtext: "Moderate caffeine", score: 2 },
        { value: "5-6", label: "5-6 cups", subtext: "High caffeine", score: 3 },
        { value: "7+", label: "7+ cups", subtext: "Excessive caffeine", score: 4 }
      ]
    },
    {
      id: 12,
      text: "Do you have learning difficulties?",
      type: "single",
      icon: "📚",
      options: [
        { value: "no", label: "No", subtext: "No difficulties", score: 0 },
        { value: "yes", label: "Yes", subtext: "Significant difficulties", score: 1 }
      ]
    },
    {
      id: 13,
      text: "How would you rate your anxiety/depression levels?",
      type: "single",
      icon: "😰",
      options: [
        { value: "0", label: "None (0)", subtext: "No symptoms", score: 0 },
        { value: "1", label: "Mild (1)", subtext: "Occasional symptoms", score: 1 },
        { value: "2", label: "Moderate (2)", subtext: "Frequent symptoms", score: 2 },
        { value: "3", label: "Severe (3)", subtext: "Severe symptoms", score: 3 }
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
        <p style={styles.subtitle}>Please answer all questions honestly for accurate assessment</p>
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