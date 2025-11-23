import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import "./AddMarks.css";

function AddMarks() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [math, setMath] = useState("");
    const [science, setScience] = useState("");
    const [english, setEnglish] = useState("");
    const [remarks, setRemarks] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        API.get("/students")
            .then(res => setStudents(res.data))
            .catch(err => {
                console.error(err);
                setError("Failed to load students");
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!selectedStudent) {
            setError("Please select a student");
            return;
        }
        try {
            const marksData = {};
            if (math !== "") marksData.math = parseFloat(math);
            if (science !== "") marksData.science = parseFloat(science);
            if (english !== "") marksData.english = parseFloat(english);
            if (remarks !== "") marksData.remarks = remarks;
            
            await API.put(`/students/${selectedStudent}/marks`, marksData);
            alert("Marks added successfully!");
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || "Error adding marks");
        }
    };

    return (
        <div className="add-marks-container">
            <div className="add-marks-card">
                <h2>Add/Update Student Marks</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Select Student *</label>
                        <select 
                            value={selectedStudent} 
                            onChange={(e) => setSelectedStudent(e.target.value)} 
                            required
                        >
                            <option value="">Choose a student...</option>
                            {students.map(s => (
                                <option key={s._id} value={s._id}>
                                    {s.name} - Roll: {s.roll} (Grade: {s.grade})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="marks-grid">
                        <div className="form-group">
                            <label>Mathematics</label>
                            <input 
                                type="number" 
                                placeholder="Enter marks (0-100)" 
                                value={math} 
                                onChange={(e) => setMath(e.target.value)} 
                                min="0"
                                max="100"
                            />
                        </div>
                        <div className="form-group">
                            <label>Science</label>
                            <input 
                                type="number" 
                                placeholder="Enter marks (0-100)" 
                                value={science} 
                                onChange={(e) => setScience(e.target.value)} 
                                min="0"
                                max="100"
                            />
                        </div>
                        <div className="form-group">
                            <label>English</label>
                            <input 
                                type="number" 
                                placeholder="Enter marks (0-100)" 
                                value={english} 
                                onChange={(e) => setEnglish(e.target.value)} 
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Remarks</label>
                        <textarea 
                            placeholder="Enter remarks (optional)" 
                            value={remarks} 
                            onChange={(e) => setRemarks(e.target.value)} 
                            rows="3"
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-primary">Save Marks</button>
                        <Link to="/dashboard" className="btn-secondary">Cancel</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddMarks;
