// Quick test script to verify MongoDB connection
require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

console.log('Testing MongoDB connection...');
console.log('Connection string (masked):', mongoUri ? mongoUri.replace(/:[^:@]+@/, ':****@') : 'NOT FOUND');

if (!mongoUri) {
    console.error('❌ MONGO_URI or MONGODB_URI not found in .env file');
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => {
        console.log('✅ Connection successful!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Connection failed:', err.message);
        console.error('\nCommon issues:');
        console.error('1. Wrong username or password');
        console.error('2. IP address not whitelisted in MongoDB Atlas');
        console.error('3. User doesn\'t have proper permissions');
        console.error('4. Password contains special characters that need URL encoding');
        process.exit(1);
    });



