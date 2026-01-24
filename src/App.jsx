import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Tracker from "./Pages/Tracker";
import Questionnaire from "./Pages/Questionnaire";
import SeverityCheck from './Pages/SeverityCheck'; // New import
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/severity-check" element={<SeverityCheck />} /> {/* New route */}
        <Route path="/questionnaire" element={<Questionnaire />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
