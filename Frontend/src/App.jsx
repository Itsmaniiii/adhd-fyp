import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Tracker from "./Pages/Tracker";
import Questionnaire from "./Pages/Questionnaire";
import SeverityCheck from './Pages/SeverityCheck';
import Chatbot from "./Pages/Chatbot";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

// Home Route - Check token
const HomeRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Home /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<HomeRoute />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/tracker" element={<ProtectedRoute><Tracker /></ProtectedRoute>} />
        <Route path="/severity-check" element={<ProtectedRoute><SeverityCheck /></ProtectedRoute>} />
        <Route path="/questionnaire" element={<ProtectedRoute><Questionnaire /></ProtectedRoute>} />


        {/* ✅ ADD THIS */}
        <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
