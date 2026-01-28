import React, { useState, useRef, useEffect } from "react";


const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your ADHD AI Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setSpeechText(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (speechText.trim()) {
          setInputValue(speechText);
          setSpeechText("");
        }
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startListening = () => {
    if (recognitionRef.current) {
      setSpeechText("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: `I understand you're asking about "${inputValue}". For ADHD management, try breaking tasks into smaller chunks and setting clear priorities. Would you like more specific strategies?`,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const suggestedQuestions = [
    "How to improve focus?",
    "ADHD productivity tips",
    "Managing time with ADHD",
    "Best focus techniques"
  ];

  return (
    <div className="chatbot-container">
      <div className="chatbot-main">
        <div className="chatbot-wrapper">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-icon-container">
              <span className="chatbot-icon">🤖</span>
            </div>
            <h1 className="chatbot-title">ADHD AI Assistant</h1>
            <p className="chatbot-subtitle">
              Get personalized support for ADHD management, productivity strategies, and focus techniques.
            </p>
            <div className="chatbot-voice-status">
              <div className={`chatbot-voice-indicator ${isListening ? 'chatbot-voice-listening' : ''}`}>
                <span className="chatbot-voice-icon">🎤</span>
                <span className="chatbot-voice-text">
                  {isListening ? 'Listening... Speak now' : 'Voice input available'}
                </span>
              </div>
            </div>
          </div>

          {/* Main Layout */}
          <div className="chatbot-layout">
            {/* Chat Section */}
            <div className="chatbot-chat-section">
              <div className="chatbot-window">
                {/* Chat Header */}
                <div className="chatbot-chat-header">
                  <div className="chatbot-header-content">
                    <div className="chatbot-header-left">
                      <div className="chatbot-header-icon">
                        <span>🧠</span>
                      </div>
                      <div className="chatbot-header-text">
                        <h2>ADHD Support Chat</h2>
                        <p>Always here to help you stay focused</p>
                      </div>
                    </div>
                    <div className="chatbot-status">
                      <span className={`chatbot-status-dot ${isListening ? 'chatbot-status-recording' : 'chatbot-status-online'}`}></span>
                      {isListening ? 'Listening...' : 'Online'}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="chatbot-messages-container">
                  <div className="chatbot-messages-wrapper">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`chatbot-message chatbot-message-${msg.sender}`}
                      >
                        <div className={`chatbot-message-bubble chatbot-message-bubble-${msg.sender}`}>
                          <div className="chatbot-message-header">
                            <span className={`chatbot-message-sender chatbot-message-sender-${msg.sender}`}>
                              {msg.sender === "user" ? "You" : "ADHD Assistant"}
                            </span>
                            <span className={`chatbot-message-time chatbot-message-time-${msg.sender}`}>
                              {msg.timestamp}
                            </span>
                          </div>
                          <p className="chatbot-message-content">{msg.text}</p>
                          {msg.sender === "user" && (
                            <div className="chatbot-message-voice-tag">
                              <span className="chatbot-voice-tag-icon">🎤</span>
                              <span className="chatbot-voice-tag-text">Voice input</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {isListening && (
                      <div className="chatbot-voice-preview">
                        <div className="chatbot-voice-preview-bubble">
                          <div className="chatbot-voice-preview-header">
                            <span className="chatbot-voice-preview-label">Listening...</span>
                            <div className="chatbot-voice-wave">
                              <span className="chatbot-wave-dot"></span>
                              <span className="chatbot-wave-dot"></span>
                              <span className="chatbot-wave-dot"></span>
                              <span className="chatbot-wave-dot"></span>
                              <span className="chatbot-wave-dot"></span>
                            </div>
                          </div>
                          <p className="chatbot-voice-preview-text">
                            {speechText || "Speak now..."}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {isLoading && (
                      <div className="chatbot-loading">
                        <div className="chatbot-loading-bubble">
                          <div className="chatbot-loading-dots">
                            <div className="chatbot-loading-dot"></div>
                            <div className="chatbot-loading-dot"></div>
                            <div className="chatbot-loading-dot"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Suggested Questions */}
                <div className="chatbot-suggestions">
                  <p className="chatbot-suggestions-title">Suggested questions:</p>
                  <div className="chatbot-suggestions-list">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setInputValue(question)}
                        className="chatbot-suggestion-button"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSendMessage} className="chatbot-input-section">
                  <div className="chatbot-form">
                    <div className="chatbot-input-wrapper">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type or use voice command..."
                        className="chatbot-input"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={toggleListening}
                        className={`chatbot-voice-btn ${isListening ? 'chatbot-voice-btn-active' : ''}`}
                        disabled={isLoading}
                        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                      >
                        <span className="chatbot-voice-btn-icon">
                          {isListening ? '⏹️' : '🎤'}
                        </span>
                        <span className="chatbot-voice-btn-text">
                          {isListening ? 'Stop' : 'Voice'}
                        </span>
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading || !inputValue.trim()}
                      className="chatbot-send-button"
                    >
                      <span>Send</span>
                      <span className="chatbot-send-icon">➤</span>
                    </button>
                  </div>
                  {isListening && (
                    <div className="chatbot-voice-instruction">
                      <span className="chatbot-voice-instruction-icon">💡</span>
                      <span className="chatbot-voice-instruction-text">
                        Speak clearly and naturally. Click microphone again when done.
                      </span>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="chatbot-sidebar">
              <div className="chatbot-sidebar-card">
                <h3 className="chatbot-sidebar-title">💡 ADHD Support Tips</h3>
                
                <div className="chatbot-tips-container">
                  <div className="chatbot-tip-card chatbot-tip-card-time">
                    <div className="chatbot-tip-icon chatbot-tip-icon-time">⏰</div>
                    <div className="chatbot-tip-content">
                      <h4>Time Management</h4>
                      <p>Use Pomodoro technique: 25 min focus, 5 min break</p>
                    </div>
                  </div>

                  <div className="chatbot-tip-card chatbot-tip-card-task">
                    <div className="chatbot-tip-icon chatbot-tip-icon-task">🎯</div>
                    <div className="chatbot-tip-content">
                      <h4>Task Breakdown</h4>
                      <p>Break large tasks into smaller, manageable steps</p>
                    </div>
                  </div>

                  <div className="chatbot-tip-card chatbot-tip-card-reminder">
                    <div className="chatbot-tip-icon chatbot-tip-icon-reminder">🔔</div>
                    <div className="chatbot-tip-content">
                      <h4>Reminders</h4>
                      <p>Set multiple reminders with clear deadlines</p>
                    </div>
                  </div>

                  <div className="chatbot-tip-card chatbot-tip-card-mindfulness">
                    <div className="chatbot-tip-icon chatbot-tip-icon-mindfulness">🧘</div>
                    <div className="chatbot-tip-content">
                      <h4>Mindfulness</h4>
                      <p>Practice 5-minute mindfulness exercises daily</p>
                    </div>
                  </div>
                </div>

                <div className="chatbot-stats">
                  <h4 className="chatbot-stats-title">Quick Stats</h4>
                  <div className="chatbot-stats-grid">
                    <div className="chatbot-stat-card">
                      <div className="chatbot-stat-value chatbot-stat-value-available">24/7</div>
                      <div className="chatbot-stat-label">Available</div>
                    </div>
                    <div className="chatbot-stat-card">
                      <div className="chatbot-stat-value chatbot-stat-value-confidential">100%</div>
                      <div className="chatbot-stat-label">Confidential</div>
                    </div>
                    <div className="chatbot-stat-card">
                      <div className="chatbot-stat-value chatbot-stat-value-voice">🎤</div>
                      <div className="chatbot-stat-label">Voice Input</div>
                    </div>
                  </div>
                </div>
                
                {/* Voice Commands Guide */}
                <div className="chatbot-voice-guide">
                  <h4 className="chatbot-voice-guide-title">Voice Commands</h4>
                  <ul className="chatbot-voice-guide-list">
                    <li className="chatbot-voice-guide-item">
                      <span className="chatbot-guide-icon">🗣️</span>
                      "How to stay focused"
                    </li>
                    <li className="chatbot-voice-guide-item">
                      <span className="chatbot-guide-icon">🗣️</span>
                      "ADHD productivity tips"
                    </li>
                    <li className="chatbot-voice-guide-item">
                      <span className="chatbot-guide-icon">🗣️</span>
                      "Help me plan my day"
                    </li>
                    <li className="chatbot-voice-guide-item">
                      <span className="chatbot-guide-icon">🗣️</span>
                      "Mindfulness techniques"
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="chatbot-footer">
            <p>This AI assistant provides general ADHD support. For medical advice, please consult a healthcare professional.</p>
            <p className="chatbot-voice-notice">
              <span className="chatbot-voice-notice-icon">ℹ️</span>
              Voice recognition works best in Chrome and Edge browsers. Make sure microphone access is allowed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;