import React, { useState } from 'react';
import { taskAPI } from '../../services/api';
import './Tasks.css';

function TaskForm({ onTaskCreated }) {
  const [input, setInput] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      await taskAPI.create({ input, useAI });
      setInput('');
      onTaskCreated();
    } catch (error) {
      alert('Failed to create task');
    }
    setLoading(false);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter task (e.g., 'follow up with designer')"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
      />
      <div className="form-actions">
        <label>
          <input
            type="checkbox"
            checked={useAI}
            onChange={(e) => setUseAI(e.target.checked)}
          />
          Enhance with AI
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
