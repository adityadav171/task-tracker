import React, { useState, useEffect } from 'react';
import { taskAPI } from '../../services/api';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';
import './Tasks.css';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [activeTimer, setActiveTimer] = useState(null);

  const fetchTasks = async () => {
    try {
      const { data } = await taskAPI.getAll();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="task-list-container">
      <h2>Tasks</h2>
      <TaskForm onTaskCreated={fetchTasks} />
      <div className="tasks-grid">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdate={fetchTasks}
            activeTimer={activeTimer}
            onTimerStart={setActiveTimer}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
