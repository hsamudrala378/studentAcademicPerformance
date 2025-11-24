# Student Academic Performance Management System

A full-stack web application for managing student academic performance with authentication, student management, and marks tracking.

## Features

- 🔐 User Authentication (Signup/Login)
- 👥 Student Management (Add, View, Update, Delete)
- 📊 Academic Performance Tracking
- 📝 Marks Entry for Multiple Subjects (Math, Science, English)
- 📈 Performance Reports with Grades and Averages
- 🎨 Modern, Responsive UI

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React.js
- React Router
- Axios for API calls
- Modern CSS with responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
cd student_academic_performance
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb://localhost:27017/student_performance
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

**Note:** If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## Running the Application

### Start MongoDB

Make sure MongoDB is running on your system. If using a local installation:

```bash
# On Windows
net start MongoDB

# On macOS/Linux
mongod
```

### Start Backend Server

```bash
cd backend
npm start
```

The backend server will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. **Sign Up**: Create a new account at `/signup`
2. **Login**: Login with your credentials at `/login`
3. **Dashboard**: View all students and their performance
4. **Add Student**: Add new students with roll number, grade, and optional email
5. **Add Marks**: Enter marks for Mathematics, Science, and English
6. **View Marks**: View detailed performance reports with grades and averages

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Students
- `GET /api/students` - Get all students (Protected)
- `POST /api/students` - Add new student (Protected)
- `PUT /api/students/:id` - Update student (Protected)
- `DELETE /api/students/:id` - Delete student (Protected)
- `PUT /api/students/:id/marks` - Add/Update marks (Protected)

## Project Structure

```
student_academic_performance/
├── backend/
│   ├── models/
│   │   ├── Student.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── students.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Dashboard.js
│   │   │   ├── AddStudent.js
│   │   │   ├── AddMarks.js
│   │   │   └── ViewMarks.js
│   │   ├── App.js
│   │   ├── api.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Environment Variables

### Backend (.env)

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `PORT`: Server port (default: 5000)

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your `MONGODB_URI` in `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

### CORS Issues
- Backend is configured to allow requests from `http://localhost:3000`
- If using a different port, update CORS settings in `backend/server.js`

### Authentication Issues
- Clear browser localStorage if experiencing token issues
- Ensure JWT_SECRET is set in `.env` file

## License

This project is open source and available for educational purposes.



