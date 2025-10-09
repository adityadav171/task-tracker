import React, { useState } from 'react';
import { taskAPI, timelogAPI } from '../../services/api';
import Timer from '../TimeTracker/Timer';

function TaskItem({ task, onUpdate, activeTimer, onTimerStart }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    status: task.status
  });

  const handleUpdate = async () => {
    try {
      await taskAPI.update(task.id, editData);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      alert('Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskAPI.delete(task.id);
        onUpdate();
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  return (
    <div className={`task-item status-${task.status.toLowerCase().replace(' ', '-')}`}>
      {isEditing ? (
        <div className="task-edit">
          <input
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          />
          <select
            value={editData.status}
            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <div className="edit-actions">
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-content">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
              {task.status}
            </span>
          </div>
          <div className="task-actions">
            <Timer
              taskId={task.id}
              isActive={activeTimer === task.id}
              onStart={() => onTimerStart(task.id)}
              onUpdate={onUpdate}
            />
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete} className="delete-btn">Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskItem;
