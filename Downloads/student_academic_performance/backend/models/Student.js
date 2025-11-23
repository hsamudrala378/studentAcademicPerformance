const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    roll: { type: String, required: true, unique: true },
    grade: { type: String, required: true },
    email: { type: String },
    scores: {
        math: { type: Number },
        science: { type: Number },
        english: { type: Number },
    },
    remarks: String,
}, { timestamps: true });

// Virtual for total marks
studentSchema.virtual('totalMarks').get(function() {
    return (this.scores.math || 0) + (this.scores.science || 0) + (this.scores.english || 0);
});

// Virtual for average marks
studentSchema.virtual('averageMarks').get(function() {
    const count = [this.scores.math, this.scores.science, this.scores.english].filter(m => m !== undefined && m !== null).length;
    return count > 0 ? this.totalMarks / count : 0;
});

module.exports = mongoose.model('Student', studentSchema);
