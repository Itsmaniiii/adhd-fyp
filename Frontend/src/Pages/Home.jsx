import React from "react";


const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="highlight">ADHD Tracker</span>
          </h1>
          <p className="hero-subtitle">
            A comprehensive tool to track your behavior, take self-assessment quizzes, 
            and monitor your progress with intuitive analytics.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="dashboard-preview">
            <div className="preview-header">
              <div className="preview-dot red"></div>
              <div className="preview-dot yellow"></div>
              <div className="preview-dot green"></div>
            </div>
            <div className="preview-content">
              <div className="preview-chart">
                <div className="chart-bar" style={{height: "70%"}}></div>
                <div className="chart-bar" style={{height: "90%"}}></div>
                <div className="chart-bar" style={{height: "50%"}}></div>
                <div className="chart-bar" style={{height: "80%"}}></div>
                <div className="chart-bar" style={{height: "60%"}}></div>
                <div className="chart-bar" style={{height: "95%"}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Key Features</h2>
        <p className="section-subtitle">
          Designed specifically to help manage ADHD symptoms and track progress
        </p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="icon-track">📊</i>
            </div>
            <h3>Behavior Tracking</h3>
            <p>Log daily activities, focus periods, and distractions to identify patterns and triggers.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="icon-quiz">🧠</i>
            </div>
            <h3>Self-Assessment</h3>
            <p>Regular quizzes to evaluate attention span, impulsivity, and emotional regulation.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="icon-progress">📈</i>
            </div>
            <h3>Progress Analytics</h3>
            <p>Visualize your improvement over time with detailed charts and insights.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="icon-reminder">⏰</i>
            </div>
            <h3>Reminders & Alerts</h3>
            <p>Customizable notifications to help maintain routines and medication schedules.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your free account in under 2 minutes.</p>
          </div>
          
          <div className="step-line"></div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Set Goals</h3>
            <p>Define what you want to track and improve.</p>
          </div>
          
          <div className="step-line"></div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Track Daily</h3>
            <p>Log your activities and take quick assessments.</p>
          </div>
          
          <div className="step-line"></div>
          
          <div className="step">
            <div className="step-number">4</div>
            <h3>Review Progress</h3>
            <p>Analyze patterns and celebrate improvements.</p>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="testimonial-section">
        <div className="testimonial-content">
          <div className="quote-icon">"</div>
          <p className="testimonial-text">
            Using ADHD Tracker has helped me understand my productivity patterns 
            and identify my most focused hours. I've improved my daily structure by 40% in just 2 months.
          </p>
          <div className="testimonial-author">
            <div className="author-avatar">JS</div>
            <div className="author-info">
              <h4>Adil Abbas</h4>
              <p>User for 6 months</p>
            </div>
          </div>
        </div>
      </section>
      <section className="testimonial-section">
        <div className="testimonial-content">
          <div className="quote-icon">"</div>
          <p className="testimonial-text">
            Using ADHD Tracker has helped me understand my productivity patterns 
            and identify my most focused hours. I've improved my daily structure by 40% in just 2 months.
          </p>
          <div className="testimonial-author">
            <div className="author-avatar">JS</div>
            <div className="author-info">
              <h4>Muhammad Hassan</h4>
              <p>User for 6 months</p>
            </div>
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="cta-section">
        <h2>Start Your ADHD Management Journey Today</h2>
        <p>Join thousands who have found structure and insight with our tracking tools.</p>
        <button className="btn btn-primary btn-large">Start Free Trial</button>
        <p className="cta-note">No credit card required • 14-day free trial</p>
      </section>
    </div>
  );
};

export default Home;