import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "./Dashboard.css";

function Dashboard() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingStudent, setEditingStudent] = useState(null);
    const [editForm, setEditForm] = useState({ math: "", science: "", english: "", remarks: "" });
    const [editError, setEditError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
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
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const calculateTotal = (student) => {
        const math = student.scores?.math ?? 0;
        const science = student.scores?.science ?? 0;
        const english = student.scores?.english ?? 0;
        const total = math + science + english;
        // If all scores are undefined/null, return 0, otherwise return total
        const hasAnyMarks = math > 0 || science > 0 || english > 0;
        return hasAnyMarks ? total : 0;
    };

    const calculateAverage = (student) => {
        const total = calculateTotal(student);
        const count = [student.scores?.math, student.scores?.science, student.scores?.english]
            .filter(m => m !== undefined && m !== null && m > 0).length;
        return count > 0 ? (total / count).toFixed(2) : 0;
    };

    const getGrade = (avg) => {
        const avgNum = parseFloat(avg);
        if (avgNum >= 90) return "A+";
        if (avgNum >= 80) return "A";
        if (avgNum >= 70) return "B";
        if (avgNum >= 60) return "C";
        if (avgNum >= 50) return "D";
        if (avgNum > 0) return "F";
        return "-";
    };

    const handleDelete = async (studentId, studentName) => {
        if (!window.confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
            return;
        }
        
        try {
            await API.delete(`/students/${studentId}`);
            alert("Student deleted successfully!");
            loadStudents(); // Reload the list
        } catch (err) {
            alert(err.response?.data?.error || "Error deleting student");
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setEditForm({
            math: student.scores?.math ?? "",
            science: student.scores?.science ?? "",
            english: student.scores?.english ?? "",
            remarks: student.remarks ?? ""
        });
        setEditError("");
    };

    const handleCloseEdit = () => {
        setEditingStudent(null);
        setEditForm({ math: "", science: "", english: "", remarks: "" });
        setEditError("");
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditError("");
        
        try {
            const marksData = {};
            if (editForm.math !== "") marksData.math = parseFloat(editForm.math);
            if (editForm.science !== "") marksData.science = parseFloat(editForm.science);
            if (editForm.english !== "") marksData.english = parseFloat(editForm.english);
            if (editForm.remarks !== "") marksData.remarks = editForm.remarks;
            
            await API.put(`/students/${editingStudent._id}/marks`, marksData);
            alert("Marks updated successfully!");
            handleCloseEdit();
            loadStudents(); // Reload the list
        } catch (err) {
            setEditError(err.response?.data?.error || err.response?.data?.message || "Error updating marks");
        }
    };

    if (loading) {
        return <div className="dashboard-loading">Loading...</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Student Academic Performance</h1>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
            <div className="dashboard-content">
                <div className="sidebar">
                    <nav className="sidebar-nav">
                        <Link to="/add-student" className="nav-link">
                            <span className="nav-icon">➕</span>
                            Add Student
                        </Link>
                        <Link to="/add-marks" className="nav-link">
                            <span className="nav-icon">📝</span>
                            Add Marks
                        </Link>
                        <Link to="/view-marks" className="nav-link">
                            <span className="nav-icon">📊</span>
                            View Marks
                        </Link>
                    </nav>
                </div>
                <div className="main-content">
                    <div className="content-header">
                        <h2>Student Dashboard</h2>
                        <p>Total Students: {students.length}</p>
                    </div>
                    {students.length === 0 ? (
                        <div className="empty-state">
                            <p>No students found. Add your first student to get started!</p>
                            <Link to="/add-student" className="btn-primary">Add Student</Link>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="students-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Roll Number</th>
                                        <th>Class</th>
                                        <th>Math</th>
                                        <th>Science</th>
                                        <th>English</th>
                                        <th>Total</th>
                                        <th>Average</th>
                                        <th>Grade</th>
                                        <th>Remarks</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((s) => {
                                        const avg = calculateAverage(s);
                                        const grade = getGrade(avg);
                                        return (
                                            <tr key={s._id}>
                                                <td>{s.name}</td>
                                                <td>{s.roll}</td>
                                                <td>{s.grade}</td>
                                                <td>{s.scores?.math ?? "-"}</td>
                                                <td>{s.scores?.science ?? "-"}</td>
                                                <td>{s.scores?.english ?? "-"}</td>
                                                <td className="total-cell">
                                                    {(() => {
                                                        const total = calculateTotal(s);
                                                        return total > 0 ? total : "-";
                                                    })()}
                                                </td>
                                                <td className="avg-cell">{avg > 0 ? avg : "-"}</td>
                                                <td className={`grade-cell grade-${grade.toLowerCase().replace('+', 'plus')}`}>
                                                    {grade}
                                                </td>
                                                <td className="remarks-cell">{s.remarks || "-"}</td>
                                                <td className="action-cell">
                                                    <button 
                                                        onClick={() => handleEdit(s)}
                                                        className="edit-btn"
                                                        title="Edit marks"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(s._id, s.name)}
                                                        className="delete-btn"
                                                        title="Delete student"
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Edit Marks Modal */}
            {editingStudent && (
                <div className="modal-overlay" onClick={handleCloseEdit}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Marks - {editingStudent.name}</h2>
                            <button className="modal-close" onClick={handleCloseEdit}>×</button>
                        </div>
                        {editError && <div className="error-message">{editError}</div>}
                        <form onSubmit={handleEditSubmit}>
                            <div className="marks-edit-grid">
                                <div className="form-group">
                                    <label>Mathematics</label>
                                    <input
                                        type="number"
                                        placeholder="Enter marks (0-100)"
                                        value={editForm.math}
                                        onChange={(e) => setEditForm({...editForm, math: e.target.value})}
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Science</label>
                                    <input
                                        type="number"
                                        placeholder="Enter marks (0-100)"
                                        value={editForm.science}
                                        onChange={(e) => setEditForm({...editForm, science: e.target.value})}
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>English</label>
                                    <input
                                        type="number"
                                        placeholder="Enter marks (0-100)"
                                        value={editForm.english}
                                        onChange={(e) => setEditForm({...editForm, english: e.target.value})}
                                        min="0"
                                        max="100"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Remarks</label>
                                <textarea
                                    placeholder="Enter remarks (optional)"
                                    value={editForm.remarks}
                                    onChange={(e) => setEditForm({...editForm, remarks: e.target.value})}
                                    rows="3"
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">Save Changes</button>
                                <button type="button" className="btn-secondary" onClick={handleCloseEdit}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
