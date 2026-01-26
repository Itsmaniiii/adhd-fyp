import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    closeMenu();
    navigate("/login");
  };

  // Determine which navbar to show based on current page
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section - Larger */}
        <div className="navbar-logo">
          {/* Logo only links to home if logged in, otherwise just displays */}
          {isLoggedIn ? (
            <Link to="/" className="logo-link">
              <div className="logo-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="logo-text-container">
                <span className="logo-main">ADHD Tracker</span>
                <span className="logo-subtitle">Mindful Progress</span>
              </div>
            </Link>
          ) : (
            <div className="logo-link" style={{cursor: "default"}}>
              <div className="logo-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="logo-text-container">
                <span className="logo-main">ADHD Tracker</span>
                <span className="logo-subtitle">Mindful Progress</span>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Navigation - Larger */}
        <div className="navbar-links">
          {/* Show Home link only if logged in OR not on auth pages */}
          {!isAuthPage && (
            <Link 
              to="/" 
              className={`nav-link ${isActive("/")}`}
              onClick={closeMenu}
            >
              <span className="nav-icon">🏠</span>
              <div className="nav-text-container">
                <span className="nav-text">Home</span>
                <span className="nav-description">Dashboard</span>
              </div>
            </Link>
          )}
          
          {/* Show these only if logged in */}
          {isLoggedIn && !isAuthPage && (
            <>
              <Link 
                to="/tracker" 
                className={`nav-link ${isActive("/tracker")}`}
                onClick={closeMenu}
              >
                <span className="nav-icon">📝</span>
                <div className="nav-text-container">
                  <span className="nav-text">Tracker</span>
                  <span className="nav-description">Daily Logs</span>
                </div>
              </Link>
              
              <Link 
                to="/questionnaire" 
                className={`nav-link ${isActive("/questionnaire")}`}
                onClick={closeMenu}
              >
                <span className="nav-icon">❓</span>
                <div className="nav-text-container">
                  <span className="nav-text">Questionnaire</span>
                  <span className="nav-description">Assessment</span>
                </div>
              </Link>
              
              <Link 
                to="/severity-check" 
                className={`nav-link ${isActive("/severity-check")}`}
                onClick={closeMenu}
              >
                <span className="nav-icon">📊</span>
                <div className="nav-text-container">
                  <span className="nav-text">Severity Check</span>
                  <span className="nav-description">Level Monitor</span>
                </div>
              </Link>
            </>
          )}
        </div>

        {/* Auth Buttons - Larger */}
        <div className="navbar-auth">
          {isLoggedIn ? (
            <>
              <div className="user-info">
                <span className="user-greeting">Welcome back!</span>
              </div>
              <button 
                onClick={handleLogout}
                className="auth-link logout-link"
              >
                <span className="auth-icon">🚪</span>
                Log Out
              </button>
            </>
          ) : isLoginPage ? (
            // On Login page - show Signup button
            <Link 
              to="/signup" 
              className="auth-link signup-link"
              onClick={closeMenu}
            >
              <span className="auth-icon">🚀</span>
              Sign Up
            </Link>
          ) : isSignupPage ? (
            // On Signup page - show Login button
            <Link 
              to="/login" 
              className="auth-link login-link"
              onClick={closeMenu}
            >
              <span className="auth-icon">👤</span>
              Log In
            </Link>
          ) : (
            // On other pages (Home) - show both
            <>
              <Link 
                to="/login" 
                className="auth-link login-link"
                onClick={closeMenu}
              >
                <span className="auth-icon">👤</span>
                Log In
              </Link>
              <Link 
                to="/signup" 
                className="auth-link signup-link"
                onClick={closeMenu}
              >
                <span className="auth-icon">🚀</span>
                Get Started Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className={`hamburger-line ${isMenuOpen ? "active" : ""}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? "active" : ""}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? "active" : ""}`}></span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-content">
          <div className="mobile-header">
            <div className="mobile-logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>ADHD Tracker</span>
            </div>
            <button className="mobile-close-btn" onClick={closeMenu}>×</button>
          </div>
          
          <div className="mobile-nav-links">
            {/* Show Home link only if not on auth pages */}
            {!isAuthPage && (
              <Link 
                to="/" 
                className={`mobile-nav-link ${isActive("/")}`}
                onClick={closeMenu}
              >
                <span className="mobile-nav-icon">🏠</span>
                <div>
                  <div className="mobile-nav-text">Home</div>
                  <div className="mobile-nav-description">Main Dashboard</div>
                </div>
              </Link>
            )}
            
            {/* Show these only if logged in */}
            {isLoggedIn && !isAuthPage && (
              <>
                <Link 
                  to="/tracker" 
                  className={`mobile-nav-link ${isActive("/tracker")}`}
                  onClick={closeMenu}
                >
                  <span className="mobile-nav-icon">📝</span>
                  <div>
                    <div className="mobile-nav-text">Tracker</div>
                    <div className="mobile-nav-description">Daily Activity Logs</div>
                  </div>
                </Link>
                
                <Link 
                  to="/questionnaire" 
                  className={`mobile-nav-link ${isActive("/questionnaire")}`}
                  onClick={closeMenu}
                >
                  <span className="mobile-nav-icon">❓</span>
                  <div>
                    <div className="mobile-nav-text">Questionnaire</div>
                    <div className="mobile-nav-description">Self Assessment</div>
                  </div>
                </Link>
                
                <Link 
                  to="/severity-check" 
                  className={`mobile-nav-link ${isActive("/severity-check")}`}
                  onClick={closeMenu}
                >
                  <span className="mobile-nav-icon">📊</span>
                  <div>
                    <div className="mobile-nav-text">Severity Checker</div>
                    <div className="mobile-nav-description">Monitor Your Level</div>
                  </div>
                </Link>
              </>
            )}
          </div>
          
          <div className="mobile-auth-section">
            {isLoggedIn ? (
              <>
                <div className="mobile-user-info">
                  <span className="mobile-user-greeting">You are logged in</span>
                  <p className="mobile-user-tagline">Track your ADHD journey</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="mobile-auth-link mobile-logout-link"
                >
                  <span className="mobile-auth-icon">🚪</span>
                  Log Out
                </button>
              </>
            ) : isLoginPage ? (
              // On Login page - show Signup button
              <>
                <div className="mobile-user-info">
                  <span className="mobile-user-greeting">Don't have an account?</span>
                  <p className="mobile-user-tagline">Create one to get started</p>
                </div>
                <Link 
                  to="/signup" 
                  className="mobile-auth-link mobile-signup-link"
                  onClick={closeMenu}
                >
                  <span className="mobile-auth-icon">🚀</span>
                  Sign Up Now
                </Link>
              </>
            ) : isSignupPage ? (
              // On Signup page - show Login button
              <>
                <div className="mobile-user-info">
                  <span className="mobile-user-greeting">Already have an account?</span>
                  <p className="mobile-user-tagline">Sign in to continue</p>
                </div>
                <Link 
                  to="/login" 
                  className="mobile-auth-link mobile-login-link"
                  onClick={closeMenu}
                >
                  <span className="mobile-auth-icon">👤</span>
                  Log In Here
                </Link>
              </>
            ) : (
              // On other pages - show both
              <>
                <div className="mobile-user-info">
                  <span className="mobile-user-greeting">Welcome to ADHD Tracker</span>
                  <p className="mobile-user-tagline">Track your symptoms, gain insights</p>
                </div>
                <div className="mobile-auth-links">
                  <Link 
                    to="/login" 
                    className="mobile-auth-link mobile-login-link"
                    onClick={closeMenu}
                  >
                    <span className="mobile-auth-icon">👤</span>
                    Log In to Your Account
                  </Link>
                  <Link 
                    to="/signup" 
                    className="mobile-auth-link mobile-signup-link"
                    onClick={closeMenu}
                  >
                    <span className="mobile-auth-icon">🚀</span>
                    Start Free Trial
                  </Link>
                </div>
              </>
            )}
          </div>
          
          <div className="mobile-menu-footer">
            <p className="mobile-tagline">Take control of your ADHD journey</p>
          </div>
        </div>
      </div>

      {/* Active Link Indicator */}
      <div className="nav-indicator"></div>
    </nav>
  );
};


export default Navbar;