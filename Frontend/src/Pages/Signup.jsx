import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    else if (formData.name.length < 2) newErrors.name = "Name must be at least 2 characters";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email address is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password = "Password must contain uppercase, lowercase, and number";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  // Password strength meter
  const passwordStrength = () => {
    const { password } = formData;
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const getStrengthClass = () => {
    const strength = passwordStrength();
    if (strength <= 1) return "strength-weak";
    if (strength <= 2) return "strength-fair";
    if (strength <= 3) return "strength-good";
    if (strength <= 4) return "strength-strong";
    return "strength-excellent";
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check terms checkbox
    const termsCheckbox = document.getElementById("terms");
    if (!termsCheckbox.checked) {
      setErrors({ submit: "You must agree to the Terms & Conditions and Privacy Policy" });
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Navigate to login after success
      navigate("/login");
    } catch (error) {
      // Show backend error
      setErrors({
        submit: error.response?.data?.message || "Signup failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page-container">
      <div className="signup-wrapper">
        <div className="signup-card">
          <div className="signup-header">
            <div className="signup-icon-container">
              <svg className="signup-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">Join our community today</p>
          </div>

          <div className="signup-form-section">
            <form onSubmit={handleSubmit}>
              {/* Submit error */}
              {errors.submit && (
                <div className="error-message submit-error">{errors.submit}</div>
              )}

              {/* Name Field */}
              <div className="form-group">
                <label className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="John Doe"
                  disabled={isSubmitting}
                  autoComplete="name"
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="john@example.com"
                  disabled={isSubmitting}
                  autoComplete="email"
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password-btn"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Password strength */}
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-header">
                      <span>Password strength:</span>
                      <span>
                        {passwordStrength() >= 4 ? "Strong" :
                         passwordStrength() >= 3 ? "Good" :
                         "Weak"}
                      </span>
                    </div>
                    <div className="strength-bar">
                      <div
                        className={`strength-fill ${getStrengthClass()}`}
                        style={{ width: `${(passwordStrength() / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>

              {/* Confirm Password Field */}
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="toggle-password-btn"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
              </div>

              {/* Terms & Conditions */}
              <div className="checkbox-container">
                <input type="checkbox" id="terms" className="checkbox-input" required />
                <span className="checkbox-custom"></span>
                <label htmlFor="terms" className="checkbox-label">
                  I agree to the Terms & Conditions and Privacy Policy
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={isSubmitting} className="signup-submit-btn">
                {isSubmitting ? (
                  <>
                    <div className="signup-spinner"></div>
                    Creating Account...
                  </>
                ) : "Create Account"}
              </button>
              {/* Already have account link */}
              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <p style={{ color: "#666", fontSize: "0.95rem" }}>
                  Already have an account?{" "}
                  <a href="/login" style={{ color: "#6366f1", textDecoration: "none", fontWeight: "600" }}>
                    Sign In
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="signup-footer">© 2024 ADHD Tracker. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Signup;
