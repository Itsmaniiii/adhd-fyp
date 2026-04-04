import React, { useState, useRef, useEffect, useCallback } from "react";
import api from "../api/axios.js";


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
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // 1. Agar aapne axios file banayi hai toh axios.post use karein, 
      // warna fetch ka URL sahi karein:
      const res = await api.post("/chat", {
        history: [...messages, userMessage].map(m => ({
          role: m.sender === "user" ? "user" : "model",
          text: m.text
        }))
      });

      if (!res.ok) throw new Error("Server down");

      const data = await res.json();

      const botResponse = {
        id: Date.now() + 1,
        text: data.reply, // Backend se 'reply' key aa rahi hai
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, botResponse]);

    } catch (err) {
      console.error("Connection Error:", err);
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        text: "⚠️ Connection failed. Make sure Backend is running on port 5000.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
    } finally {
      setIsLoading(false);
    }
  };
const handleVoiceSend = useCallback(async (text) => {
  const userMessage = {
    id: Date.now(),
    text,
    sender: "user",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  };

  setMessages(prev => [...prev, userMessage]);
  setIsLoading(true);

  try {
    const { data } = await api.post('/chat', {
      history: [...messages, userMessage].map(m => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.text
      }))
    });

    const botResponse = {
      id: Date.now() + 1,
      text: data.reply,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, botResponse]);

    // 🔊 BOT VOICE RESPONSE
    speakText(data.reply);

  } catch (err) {
    console.error(err);
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      text: "⚠️ Connection failed. Make sure Backend is running on port 5000.",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }]);
  } finally {
    setIsLoading(false);
  }
}, []);

const speakText = (text) => {
  // Check if speech synthesis is supported
  if (!window.speechSynthesis) {
    console.warn('Speech synthesis not supported in this browser');
    return;
  }

  if (!text || typeof text !== 'string') {
    console.warn('Invalid text provided for speech');
    return;
  }

  // Cancel any currently speaking text to avoid overlap
  window.speechSynthesis.cancel();

  // Enhanced text cleaning
  const cleanText = text
    // Remove special characters, symbols, and unwanted punctuation
    .replace(/[*@#$%^&*()_+=[\]{}|;:"'<>,./?\\-]/g, ' ')
    // Remove URLs
    .replace(/(https?:\/\/[^\s]+)/g, '')
    // Remove email addresses
    .replace(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/g, '')
    // Remove hashtags and mentions
    .replace(/[#@]\w+/g, '')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Trim whitespace
    .trim();

  // If nothing left after cleaning, return
  if (!cleanText) {
    console.warn('No valid text to speak after cleaning');
    return;
  }

  console.log('Cleaned text for speech:', cleanText);

  // Enhanced language detection
  const containsUrdu = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0700-\u074F]/.test(cleanText);
  const containsEnglish = /[a-zA-Z]/.test(cleanText);

  // Create utterance with cleaned text
  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Set language based on content with better detection
  let selectedLang = 'en-US';
  
  if (containsUrdu && !containsEnglish) {
    // Only Urdu content
    selectedLang = 'ur-PK';
  } else if (containsUrdu && containsEnglish) {
    // Mixed content - prioritize based on majority
    const urduChars = (cleanText.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0700-\u074F]/g) || []).length;
    const englishChars = (cleanText.match(/[a-zA-Z]/g) || []).length;
    selectedLang = urduChars > englishChars ? 'ur-PK' : 'en-US';
  } else {
    selectedLang = 'en-US';
  }

  utterance.lang = selectedLang;
  utterance.rate = 1;     // Normal speed
  utterance.pitch = 1.1;  // Slightly higher pitch for female voice
  utterance.volume = 1;   // Full volume

  // Handle voices - ONLY FEMALE VOICES
  const handleVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    
    if (voices.length === 0) {
      console.warn('No voices available');
      window.speechSynthesis.speak(utterance);
      return;
    }

    // Find FEMALE voices for the selected language
    const femaleVoices = voices.filter(voice => {
      const voiceName = voice.name.toLowerCase();
      const isFemale = voiceName.includes('female') || 
                      voiceName.includes('woman') || 
                      voiceName.includes('lady') ||
                      voiceName.includes('samantha') || // Common female voice names
                      voiceName.includes('zira') ||
                      voiceName.includes('veena') ||
                      voiceName.includes('karen') ||
                      voiceName.includes('tessa') ||
                      voiceName.includes('susan') ||
                      voiceName.includes('catherine') ||
                      voiceName.includes('audrey') ||
                      voiceName.includes('google uk female') ||
                      voiceName.includes('microsoft zira') ||
                      voiceName.includes('microsoft heera') ||
                      voiceName.includes('microsoft hema');
      
      if (selectedLang === 'ur-PK') {
        // For Urdu, check for female voices
        return isFemale && (voice.lang.startsWith('ur') || 
               voice.lang === 'ur-PK' || 
               voice.lang === 'ur' ||
               voice.name.toLowerCase().includes('urdu'));
      } else {
        // For English, check for female voices
        return isFemale && (voice.lang.startsWith('en') || 
               voice.lang === 'en-US' || 
               voice.lang === 'en-GB' ||
               voice.name.toLowerCase().includes('english'));
      }
    });

    if (femaleVoices.length > 0) {
      // Sort female voices by quality (prefer natural/local voices)
      const sortedFemaleVoices = femaleVoices.sort((a, b) => {
        const aQuality = a.name.toLowerCase().includes('natural') ? 3 : 
                        a.name.toLowerCase().includes('premium') ? 2 : 
                        a.name.toLowerCase().includes('female') ? 1 : 0;
        const bQuality = b.name.toLowerCase().includes('natural') ? 3 : 
                        b.name.toLowerCase().includes('premium') ? 2 : 
                        b.name.toLowerCase().includes('female') ? 1 : 0;
        return bQuality - aQuality;
      });
      
      utterance.voice = sortedFemaleVoices[0];
      console.log('Selected female voice:', utterance.voice?.name, 'for language:', selectedLang);
    } else {
      // If no specific female voice found, try to find any female voice
      const anyFemaleVoice = voices.find(voice => {
        const voiceName = voice.name.toLowerCase();
        return voiceName.includes('female') || 
               voiceName.includes('woman') || 
               voiceName.includes('lady') ||
               voiceName.includes('samantha') ||
               voiceName.includes('zira');
      });
      
      if (anyFemaleVoice) {
        utterance.voice = anyFemaleVoice;
        console.log('Using generic female voice:', utterance.voice?.name);
      } else {
        // Last resort: Use first available voice but adjust pitch higher
        utterance.voice = voices[0];
        utterance.pitch = 1.2; // Higher pitch to sound more feminine
        console.warn('No female voice found. Using default voice with adjusted pitch.');
      }
    }

    // Set up event handlers
    utterance.onstart = () => {
      console.log('Female speech synthesis started');
    };

    utterance.onend = () => {
      console.log('Female speech synthesis ended');
    };

    utterance.onerror = (event) => {
      console.error('Female speech synthesis error:', event.error);
    };

    utterance.onpause = () => {
      console.log('Female speech synthesis paused');
    };

    utterance.onresume = () => {
      console.log('Female speech synthesis resumed');
    };

    // Speak the text
    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error speaking text with female voice:', error);
    }
  };

  // Check if voices are loaded
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    handleVoices();
  } else {
    // Wait for voices to load
    window.speechSynthesis.onvoiceschanged = handleVoices;
  }
};

useEffect(() => {
  if (!isListening && speechText.trim()) {
    handleVoiceSend(speechText);
    setSpeechText("");
  }
}, [isListening, speechText, handleVoiceSend]);

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