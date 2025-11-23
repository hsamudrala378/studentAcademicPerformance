const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const auth = require('../middleware/auth');

// Get all students
router.get('/', auth, async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a student
router.post('/', auth, async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        const saved = await newStudent.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update student
router.put('/:id', auth, async (req, res) => {
    try {
        const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete student
router.delete('/:id', auth, async (req, res) => {
    try {
        const deleted = await Student.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add/Update marks for a student
router.put('/:id/marks', auth, async (req, res) => {
    try {
        const { math, science, english, remarks } = req.body;
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        if (math !== undefined) student.scores.math = math;
        if (science !== undefined) student.scores.science = science;
        if (english !== undefined) student.scores.english = english;
        if (remarks !== undefined) student.remarks = remarks;
        
        await student.save();
        res.json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
