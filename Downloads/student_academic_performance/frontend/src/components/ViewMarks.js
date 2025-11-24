import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "./ViewMarks.css";

function ViewMarks() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const navigate = useNavigate();

    const loadStudents = useCallback(async () => {
        try {
            const res = await API.get("/students");
            setStudents(res.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        loadStudents();
    }, [loadStudents]);

    const calculateTotal = (student) => {
        const math = student.scores?.math || 0;
        const science = student.scores?.science || 0;
        const english = student.scores?.english || 0;
        return math + science + english;
    };

    const calculateAverage = (student) => {
        const total = calculateTotal(student);
        const count = [student.scores?.math, student.scores?.science, student.scores?.english]
            .filter(m => m !== undefined && m !== null && m > 0).length;
        return count > 0 ? (total / count).toFixed(2) : 0;
    };

    const getGrade = (avg) => {
        if (avg >= 90) return "A+";
        if (avg >= 80) return "A";
        if (avg >= 70) return "B";
        if (avg >= 60) return "C";
        if (avg >= 50) return "D";
        return "F";
    };

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(filter.toLowerCase()) ||
        s.roll.toLowerCase().includes(filter.toLowerCase()) ||
        s.grade.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) {
        return <div className="view-marks-loading">Loading...</div>;
    }

    return (
        <div className="view-marks-container">
            <div className="view-marks-header">
                <h1>Student Academic Performance Report</h1>
                <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
            </div>
            <div className="view-marks-content">
                <div className="filter-section">
                    <input
                        type="text"
                        placeholder="Search by name, roll number, or grade..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="search-input"
                    />
                </div>
                {filteredStudents.length === 0 ? (
                    <div className="empty-state">
                        <p>{filter ? "No students found matching your search." : "No students found."}</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="marks-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Roll No.</th>
                                    <th>Grade</th>
                                    <th>Mathematics</th>
                                    <th>Science</th>
                                    <th>English</th>
                                    <th>Total</th>
                                    <th>Average</th>
                                    <th>Grade</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map(s => {
                                    const avg = parseFloat(calculateAverage(s));
                                    return (
                                        <tr key={s._id}>
                                            <td className="name-cell">{s.name}</td>
                                            <td>{s.roll}</td>
                                            <td>{s.grade}</td>
                                            <td className="score-cell">{s.scores?.math ?? "-"}</td>
                                            <td className="score-cell">{s.scores?.science ?? "-"}</td>
                                            <td className="score-cell">{s.scores?.english ?? "-"}</td>
                                            <td className="total-cell">{calculateTotal(s)}</td>
                                            <td className="avg-cell">{avg > 0 ? avg : "-"}</td>
                                            <td className={`grade-cell grade-${getGrade(avg).toLowerCase()}`}>
                                                {avg > 0 ? getGrade(avg) : "-"}
                                            </td>
                                            <td className="remarks-cell">{s.remarks || "-"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewMarks;
