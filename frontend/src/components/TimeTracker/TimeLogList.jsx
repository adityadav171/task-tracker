import React, { useState, useEffect } from 'react';
import { timelogAPI } from '../../services/api';
import './Timer.css';

function TimeLogList() {
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeLogs();
  }, []);

  const fetchTimeLogs = async () => {
    try {
      const { data } = await timelogAPI.getAll();
      setTimeLogs(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch time logs');
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupLogsByTask = () => {
    const grouped = {};
    timeLogs.forEach(log => {
      const taskId = log.taskId;
      if (!grouped[taskId]) {
        grouped[taskId] = {
          taskTitle: log.Task?.title || 'Unknown Task',
          logs: [],
          totalDuration: 0
        };
      }
      grouped[taskId].logs.push(log);
      grouped[taskId].totalDuration += log.duration || 0;
    });
    return grouped;
  };

  if (loading) {
    return <div className="loading">Loading time logs...</div>;
  }

  const groupedLogs = groupLogsByTask();

  return (
    <div className="timelog-list-container">
      <h2>Time Logs</h2>
      
      {timeLogs.length === 0 ? (
        <div className="empty-state">
          <p>No time logs yet. Start tracking time on your tasks!</p>
        </div>
      ) : (
        <div className="timelog-groups">
          {Object.entries(groupedLogs).map(([taskId, taskData]) => (
            <div key={taskId} className="timelog-group">
              <div className="timelog-group-header">
                <h3>{taskData.taskTitle}</h3>
                <span className="total-time">
                  Total: {formatDuration(taskData.totalDuration)}
                </span>
              </div>
              
              <div className="timelog-items">
                {taskData.logs.map((log) => (
                  <div key={log.id} className="timelog-item">
                    <div className="timelog-time">
                      <div className="time-block">
                        <span className="time-label">Started:</span>
                        <span className="time-value">{formatDateTime(log.startTime)}</span>
                      </div>
                      {log.endTime && (
                        <div className="time-block">
                          <span className="time-label">Ended:</span>
                          <span className="time-value">{formatDateTime(log.endTime)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="timelog-duration">
                      {log.endTime ? (
                        <span className="duration-badge">
                          {formatDuration(log.duration)}
                        </span>
                      ) : (
                        <span className="duration-badge active">
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TimeLogList;
