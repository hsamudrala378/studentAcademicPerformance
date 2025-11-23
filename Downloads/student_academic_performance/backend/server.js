const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const studentRoutes = require('./routes/students');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/student_performance';
console.log("Attempting to connect to MongoDB...");
console.log("Connection string (masked):", mongoUri.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(mongoUri)
    .then(() => console.log("✅ MongoDB connected successfully!"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        console.error("\nTroubleshooting tips:");
        console.error("1. Check your .env file has MONGO_URI or MONGODB_URI");
        console.error("2. Verify username and password in MongoDB Atlas");
        console.error("3. Ensure your IP is whitelisted in Network Access");
        console.error("4. Check Database Access permissions for your user");
        process.exit(1);
    });

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
