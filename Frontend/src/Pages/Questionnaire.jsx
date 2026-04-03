import React, { useState } from "react";
import SeverityCheck from '../Pages/SeverityCheck';

const Questionnaire = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Questions with their options - User will input these
  const questions = [
    {
      id: 1,
      text: "What is your age?",
      type: "single",
      options: [
        { value: "15-18", label: "15-18 years", score: 0 },
        { value: "19-22", label: "19-22 years", score: 1 },
        { value: "23-26", label: "23-26 years", score: 2 },
        { value: "27+", label: "27+ years", score: 3 }
      ]
    },
    {
      id: 2,
      text: "What is your gender?",
      type: "single",
      options: [
        { value: "male", label: "Male", score: 0 },
        { value: "female", label: "Female", score: 1 },
        { value: "other", label: "Other", score: 2 }
      ]
    },
    {
      id: 3,
      text: "What is your home language?",
      type: "single",
      options: [
        { value: "english", label: "English", score: 0 },
        { value: "Urdu", label: "Urdu", score: 1 },
        { value: "Sindhi", label: "Sindhi", score: 2 },
        { value: "Punjabi", label: "Punjabi", score: 3 },
        { value: "other", label: "Other", score: 4 }
      ]
    },
    {
      id: 4,
      text: "Have you ever experienced any mental health difficulties before starting university?",
      type: "single",
      options: [
        { value: "yes", label: "Yes", score: 1 },
        { value: "no", label: "No", score: 0 }
      ]
    },
    {
      id: 5,
      text: "Have you ever been diagnosed with a mental illness?",
      type: "single",
      options: [
        { value: "yes_formal", label: "Yes, formally diagnosed", score: 2 },
        { value: "yes_informal", label: "Yes, informally/self-diagnosed", score: 1 },
        { value: "no", label: "No", score: 0 }
      ]
    },
    {
      id: 6,
      text: "Have you ever used prescribed psychiatric medication?",
      type: "single",
      options: [
        { value: "yes", label: "Yes", score: 1 },
        { value: "no", label: "No", score: 0 }
      ]
    },
    {
      id: 7,
      text: "Are you currently in therapy or counselling?",
      type: "single",
      options: [
        { value: "yes", label: "Yes", score: 1 },
        { value: "no", label: "No", score: 0 }
      ]
    },
    {
      id: 8,
      text: "How would you rate your current stress level?",
      type: "single",
      options: [
        { value: "low", label: "Low (1-3)", score: 1 },
        { value: "moderate", label: "Moderate (4-7)", score: 2 },
        { value: "high", label: "High (8-10)", score: 3 }
      ]
    },
    {
      id: 9,
      text: "How many hours do you sleep on average?",
      type: "single",
      options: [
        { value: "7-9", label: "7-9 hours (optimal)", score: 0 },
        { value: "5-6", label: "5-6 hours", score: 1 },
        { value: "less_5", label: "Less than 5 hours", score: 2 },
        { value: "more_9", label: "More than 9 hours", score: 1 }
      ]
    },
    {
      id: 10,
      text: "Do you exercise regularly?",
      type: "single",
      options: [
        { value: "daily", label: "Daily", score: 0 },
        { value: "weekly", label: "2-3 times per week", score: 1 },
        { value: "rarely", label: "Rarely", score: 2 },
        { value: "never", label: "Never", score: 3 }
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
    // Check if all questions are answered
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
      <div style={styles.header}>
        <h2>📋 Self Assessment</h2>
        <p>Please answer all questions honestly</p>
      </div>

      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div style={{...styles.progressFill, width: `${progress}%`}} />
        </div>
        <p style={styles.progressText}>Question {currentQuestion + 1} of {questions.length}</p>
      </div>

      <div style={styles.questionCard}>
        <div style={styles.questionNumber}>Question {currentQ.id}</div>
        <h3 style={styles.questionText}>{currentQ.text}</h3>
        
        <div style={styles.optionsContainer}>
          {currentQ.options.map((option, idx) => (
            <label key={idx} style={styles.optionCard}>
              <input
                type="radio"
                name={`question-${currentQ.id}`}
                value={option.value}
                checked={answers[currentQ.id]?.value === option.value}
                onChange={() => handleAnswer(currentQ.id, option.value, option.score)}
                style={styles.radio}
              />
              <div style={styles.optionContent}>
                <span style={styles.optionLabel}>{option.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div style={styles.buttonContainer}>
        <button 
          onClick={handlePrevious} 
          disabled={currentQuestion === 0}
          style={{...styles.button, ...styles.buttonSecondary, opacity: currentQuestion === 0 ? 0.5 : 1}}
        >
          ← Previous
        </button>
        
        {currentQuestion < questions.length - 1 ? (
          <button onClick={handleNext} style={{...styles.button, ...styles.buttonPrimary}}>
            Next →
          </button>
        ) : (
          <button onClick={handleSubmit} style={{...styles.button, ...styles.buttonSubmit}}>
            Submit Assessment
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '700px',
    margin: '50px auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #f0f0f0'
  },
  progressContainer: {
    marginBottom: '30px'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    transition: 'width 0.3s ease'
  },
  progressText: {
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '14px',
    color: '#666'
  },
  questionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '30px'
  },
  questionNumber: {
    fontSize: '14px',
    color: '#6c757d',
    marginBottom: '10px',
    fontWeight: '500'
  },
  questionText: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '25px'
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  optionCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '2px solid #e9ecef'
  },
  radio: {
    marginRight: '15px',
    cursor: 'pointer',
    width: '18px',
    height: '18px'
  },
  optionContent: {
    flex: 1
  },
  optionLabel: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333'
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'space-between'
  },
  button: {
    flex: 1,
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  buttonPrimary: {
    backgroundColor: '#2196F3',
    color: 'white'
  },
  buttonSecondary: {
    backgroundColor: '#6c757d',
    color: 'white'
  },
  buttonSubmit: {
    backgroundColor: '#4CAF50',
    color: 'white'
  }
};

export default Questionnaire;