import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import "./AddStudent.css";

function AddStudent() {
    const [name, setName] = useState("");
    const [roll, setRoll] = useState("");
    const [grade, setGrade] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await API.post("/students", { name, roll, grade, email });
            alert("Student added successfully!");
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || "Error adding student");
        }
    };

    return (
        <div className="add-student-container">
            <div className="add-student-card">
                <h2>Add New Student</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Student Name *</label>
                        <input 
                            type="text" 
                            placeholder="Enter student name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Roll Number *</label>
                        <input 
                            type="text" 
                            placeholder="Enter roll number" 
                            value={roll} 
                            onChange={(e) => setRoll(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Grade/Class *</label>
                        <input 
                            type="text" 
                            placeholder="e.g., 10th, 11th, 12th" 
                            value={grade} 
                            onChange={(e) => setGrade(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Email (Optional)</label>
                        <input 
                            type="email" 
                            placeholder="Enter email address" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-primary">Add Student</button>
                        <Link to="/dashboard" className="btn-secondary">Cancel</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddStudent;
