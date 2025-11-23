import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await API.post("/auth/login", { email, password });
            if (res.data && res.data.token) {
                localStorage.setItem("token", res.data.token);
                // Use window.location.href for a full page navigation
                // This ensures App component re-initializes and checks the token
                window.location.href = "/dashboard";
            } else {
                setError("No token received from server. Please try again.");
                setLoading(false);
            }
        } catch (err) {
            console.error("Login error:", err);
            const errorMessage = err.response?.data?.message || err.message || "Login failed. Please check your credentials.";
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Student Academic Performance</h1>
                    <h2>Login</h2>
                </div>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p className="auth-footer">
                    Don't have an account? <Link to="/signup" className="auth-link">Sign up here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
