# Task and Time Tracking App 📋⏱️

A full-stack web application for managing tasks and tracking time with real-time timers and AI-powered task enhancement using Google Gemini API.

## 🌐 Live Demo

**🔗 Application**: https://task-tracker239.netlify.app/

**🔗 Backend API**: https://task-tracker-backend-cxpw.onrender.com

> ⚠️ **Note**: The backend is hosted on Render's free tier and may take 30-60 seconds to wake up on the first request after inactivity.

## 🧪 Test Credentials

For easier review, you can use these test credentials:
Email: demo@example.com
Password: demo123456


Or feel free to create your own account using the signup feature.

## ✨ Features

### Core Functionality
- ✅ **User Authentication**: Secure signup, login, and logout with JWT tokens
- ✅ **Task Management**: Create, read, update, and delete tasks
- ✅ **Natural Language Input**: Create tasks using simple descriptions
- ✅ **AI-Powered Enhancement**: Auto-generate clear titles and structured descriptions using Google Gemini API
- ✅ **Real-Time Time Tracking**: Start/stop timers for each task with live elapsed time display
- ✅ **Task Status Management**: Track tasks as Pending, In Progress, or Completed
- ✅ **Time Logs**: View all time tracking sessions with start/end times and duration
- ✅ **Daily Summary**: Visualize daily productivity with task counts and total time tracked

### Security & Authorization
- 🔒 Protected routes requiring authentication
- 🔒 Users can only access their own tasks and time logs
- 🔒 All API endpoints enforce proper authorization checks
- 🔒 Secure password hashing with bcrypt

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0 - UI library
- **React Router** 6.20.0 - Client-side routing
- **Axios** 1.6.2 - HTTP client
- **CSS3** - Styling with modern layouts

### Backend
- **Node.js** - Runtime environment
- **Express** 4.18.2 - Web framework
- **PostgreSQL** - Relational database
- **Sequelize** 6.35.0 - ORM for database operations
- **JWT** 9.0.2 - Authentication tokens
- **bcryptjs** 2.4.3 - Password hashing

### AI Integration
- **Google Gemini API** - AI-powered task enhancement

### Deployment
- **Netlify** - Frontend hosting
- **Render** - Backend hosting and PostgreSQL database

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v14 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**
- **Git**

### Local Development Setup

#### 1. Clone the Repository
#### 2. Backend Setup
#### 3. Create .env file
#### 4. Create PostgreSQL database
#### 5. Start the backend server (npm run dev)

The backend will start at `http://localhost:5000`

#### 3. Frontend Setup
Open a new terminal
Navigate to frontend folder
cd frontend

Install dependencies
npm install

Create .env file

        cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:5000/api
EOF

Start the frontend
npm start


The frontend will open at `http://localhost:3000`

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

#### Tasks
- `GET /api/tasks` - Get all tasks (authenticated)
- `POST /api/tasks` - Create new task (authenticated)
- `PUT /api/tasks/:id` - Update task (authenticated)
- `DELETE /api/tasks/:id` - Delete task (authenticated)

#### Time Logs
- `POST /api/timelogs/start` - Start time tracking (authenticated)
- `PUT /api/timelogs/stop/:id` - Stop time tracking (authenticated)
- `GET /api/timelogs` - Get all time logs (authenticated)
- `GET /api/timelogs/daily-summary` - Get daily summary (authenticated)





