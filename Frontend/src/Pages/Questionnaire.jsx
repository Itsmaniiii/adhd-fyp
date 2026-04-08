import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SeverityCheck from '../Pages/SeverityCheck';
import { submitQuestionnaire } from "../api/questionnaire";
import { isAuthenticated, getUserId } from "../api/auth";
import api from "../api/axios";

const Questionnaire = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      id: 1,
      section: "Inattention",
      text: "How often do you have trouble sustaining attention in tasks or activities?",
      type: "single",
      icon: "🎯",
      options: [
        { value: "never", label: "Never", score: 0 },
        { value: "sometimes", label: "Sometimes", score: 1 },
        { value: "often", label: "Often", score: 2 },
        { value: "very_often", label: "Very Often", score: 3 }
      ]
    },
    {
      id: 2,
      section: "Inattention",
      text: "How often do you make careless mistakes in work or daily activities?",
      type: "single",
      icon: "📝",
      options: [
        { value: "never", label: "Never", score: 0 },
        { value: "sometimes", label: "Sometimes", score: 1 },
        { value: "often", label: "Often", score: 2 },
        { value: "very_often", label: "Very Often", score: 3 }
      ]
    },
    {
      id: 3,
      section: "Inattention",
      text: "How often do you have difficulty organizing tasks and managing time?",
      type: "single",
      icon: "📋",
      options: [
        { value: "never", label: "Never", score: 0 },
        { value: "sometimes", label: "Sometimes", score: 1 },
        { value: "often", label: "Often", score: 2 },
        { value: "very_often", label: "Very Often", score: 3 }
      ]
    },
    {
      id: 4,
      section: "Inattention",
      text: "How often do you lose important things (e.g., keys, phone, documents)?",
      type: "single",
      icon: "🔑",
      options: [
        { value: "never", label: "Never", score: 0 },
        { value: "sometimes", label: "Sometimes", score: 1 },
        { value: "often", label: "Often", score: 2 },
        { value: "very_often", label: "Very Often", score: 3 }
      ]
    },
    {
      id: 5,
      section: "Hyperactivity",
      text: "How often do you fidget, tap hands/feet, or feel restless?",
      type: "single",
      icon: "🪑",
      options: [
        { value: "never", label: "Never", score: 0 },
        { value: "sometimes", label: "Sometimes", score: 1 },
        { value: "often", label: "Often", score: 2 },
        { value: "very_often", label: "Very Often", score: 3 }
      ]
    },
    {
      id: 6,
      section: "Hyperactivity",
      text: "How often do you feel overly active or unable to stay still?",
      type: "single",
      icon: "🏃",
      options: [
        { value: "never", label: "Never", score: 0 },
        { value: "sometimes", label: "Sometimes", score: 1 },
        { value: "often", label: "Often", score: 2 },
        { value: "very_often", label: "Very Often", score: 3 }
      ]
    },
    {
      id: 7,
      section: "Impulsivity",
      text: "How often do you interrupt others or speak without thinking?",
      type: "single",
      icon: "🗣️",
      options: [
        { value: "never", label: "Never", score: 0 },
        { value: "sometimes", label: "Sometimes", score: 1 },
        { value: "often", label: "Often", score: 2 },
        { value: "very_often", label: "Very Often", score: 3 }
      ]
    },
    {
      id: 8,
      section: "Impulsivity",
      text: "How often do you have difficulty waiting your turn?",
      type: "single",
      icon: "⏳",
      options: [
        { value: "never", label: "Never", score: 0 },
        { value: "sometimes", label: "Sometimes", score: 1 },
        { value: "often", label: "Often", score: 2 },
        { value: "very_often", label: "Very Often", score: 3 }
      ]
    },
    {
      id: 9,
      section: "History",
      text: "Did these symptoms begin before the age of 12?",
      type: "single",
      icon: "🧒",
      options: [
        { value: "yes", label: "Yes", score: 1 },
        { value: "no", label: "No", score: 0 }
      ]
    },
    {
      id: 10,
      section: "Impairment",
      text: "Do these symptoms negatively affect your work, school, or daily life?",
      type: "single",
      icon: "⚠️",
      options: [
        { value: "no", label: "No impact", score: 0 },
        { value: "mild", label: "Mild impact", score: 1 },
        { value: "moderate", label: "Moderate impact", score: 2 },
        { value: "severe", label: "Severe impact", score: 3 }
      ]
    }
  ];
  const handleAnswer = (questionId, value, score) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { value, score: Number(score) }
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

  const handleSubmit = async () => {
    const allAnswered = questions.every(q => answers[q.id]);
    if (!allAnswered) {
      alert("Please answer all questions before submitting!");
      return;
    }

    if (!isAuthenticated()) {
      alert("⚠️ Please login first!");
      return;
    }

    setIsLoading(true);

    try {
      const userId = getUserId();
      const formattedQuestions = questions.map(q => ({
        id: q.id,
        question: q.text,
        section: q.section,
        answer: answers[q.id].value,
        score: Number(answers[q.id].score) || 0
      }));

      let predictionData = null;

      try {
        const prediction = await api.post("/predict/adhd", {
          answers: formattedQuestions
        });
        predictionData = prediction.data;
      } catch (mlError) {
        console.error("🤖 ML failed:", mlError);
      }

      navigate("/severity-check", {
        state: {
          answers,
          questions,
          prediction: predictionData
        }
      });

      submitQuestionnaire(userId, formattedQuestions)
        .catch(err => console.error("❌ Save failed:", err));

    } catch (err) {
      alert(err.message || "Submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Updated Progress Calculation: Based on actual answers
  const currentQ = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  if (submitted) {
    return <SeverityCheck answers={answers} questions={questions} />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerIcon}>🧠</div>
        <h1 style={styles.title}>ADHD Clinical Assessment</h1>
        <p style={styles.subtitle}>Based on DSM-5 Diagnostic Criteria</p>
      </div>

      <div style={styles.progressSection}>
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>Section: {currentQ.section}</span>
          <span style={styles.progressPercent}>{Math.round(progress)}%</span>
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%`, transition: 'width 0.4s ease-in-out' }} />
        </div>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#666', marginTop: '8px' }}>
            {answeredCount} of {questions.length} questions answered
        </p>
      </div>

      <div style={styles.questionCard}>
        <div style={styles.questionHeader}>
          <span style={styles.questionIcon}>{currentQ.icon}</span>
          <span style={styles.questionNumber}>Question {currentQuestion + 1}</span>
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
                {option.subtext && <div style={styles.optionSubtext}>{option.subtext}</div>}
              </div>
              {answers[currentQ.id]?.value === option.value && <div style={styles.checkMark}>✓</div>}
            </label>
          ))}
        </div>
      </div>

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
          ← Back
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button onClick={handleNext} style={{ ...styles.button, ...styles.buttonPrimary }}>
            Next Question →
          </button>
        ) : (
          <button 
            onClick={handleSubmit} 
            disabled={isLoading}
            style={{ ...styles.button, ...styles.buttonSubmit }}
          >
            {isLoading ? "Processing..." : "Complete Assessment ✓"}
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
        borderRadius: '4px'
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