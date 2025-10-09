import React, { useState, useEffect } from 'react';
import { timelogAPI } from '../../services/api';
import './Dashboard.css';

function DailySummary() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const { data } = await timelogAPI.getDailySummary();
      setSummary(data);
    } catch (error) {
      console.error('Failed to fetch summary');
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (!summary) return <div>Loading...</div>;

  return (
    <div className="daily-summary">
      <h2>Today's Summary</h2>
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Time</h3>
          <p className="big-number">{formatDuration(summary.totalTime)}</p>
        </div>
        <div className="summary-card">
          <h3>Tasks Worked On</h3>
          <p className="big-number">{summary.tasksWorkedOn}</p>
        </div>
        <div className="summary-card">
          <h3>Completed</h3>
          <p className="big-number">{summary.completedTasks}</p>
        </div>
        <div className="summary-card">
          <h3>In Progress</h3>
          <p className="big-number">{summary.inProgressTasks}</p>
        </div>
      </div>

      <div className="summary-section">
        <h3>Tasks Today</h3>
        <div className="task-summary-list">
          {summary.tasks.map((task) => (
            <div key={task.id} className="task-summary-item">
              <span>{task.title}</span>
              <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DailySummary;
