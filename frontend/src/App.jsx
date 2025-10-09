import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import TaskList from './components/Tasks/TaskList';
import DailySummary from './components/Dashboard/DailySummary';
import TimeLogList from './components/TimeTracker/TimeLogList';
import './App.css';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
}

function Navbar() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <h1>Task Tracker</h1>
      <div className="nav-links">
        <Link to="/dashboard">Summary</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/timelogs">Time Logs</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Navbar />
              <DailySummary />
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Navbar />
              <TaskList />
            </PrivateRoute>
          }
        />
        <Route
          path="/timelogs"
          element={
            <PrivateRoute>
              <Navbar />
              <TimeLogList />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
