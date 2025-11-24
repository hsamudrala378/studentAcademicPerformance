import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AddStudent from "./components/AddStudent";
import AddMarks from "./components/AddMarks";
import ViewMarks from "./components/ViewMarks";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    // Check for token changes
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    // Listen for storage changes (when token is set in another tab/component)
    window.addEventListener('storage', checkAuth);
    
    // Check on mount and periodically
    checkAuth();
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/add-student" element={isLoggedIn ? <AddStudent /> : <Navigate to="/login" replace />} />
        <Route path="/add-marks" element={isLoggedIn ? <AddMarks /> : <Navigate to="/login" replace />} />
        <Route path="/view-marks" element={isLoggedIn ? <ViewMarks /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
