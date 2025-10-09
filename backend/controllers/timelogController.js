const TimeLog = require('../models/TimeLog');
const Task = require('../models/Task');
const { Op } = require('sequelize');

exports.startTracking = async (req, res) => {
  try {
    const { taskId } = req.body;
    
    // Validate taskId
    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }
    
    const task = await Task.findOne({ where: { id: taskId, userId: req.userId } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Check for active timer
    const activeLog = await TimeLog.findOne({
      where: { taskId, userId: req.userId, endTime: null }
    });
    
    if (activeLog) {
      return res.status(400).json({ error: 'Timer already running for this task' });
    }
    
    const timeLog = await TimeLog.create({
      taskId,
      userId: req.userId,
      startTime: new Date()
    });
    
    // Update task status
    if (task.status === 'Pending') {
      await task.update({ status: 'In Progress' });
    }
    
    res.status(201).json(timeLog);
  } catch (error) {
    console.error('Start tracking error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.stopTracking = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate id
    if (!id || id === 'null' || id === 'undefined') {
      return res.status(400).json({ error: 'Invalid time log ID' });
    }
    
    const timeLog = await TimeLog.findOne({
      where: { id, userId: req.userId, endTime: null }
    });
    
    if (!timeLog) {
      return res.status(404).json({ error: 'Active time log not found' });
    }
    
    const endTime = new Date();
    const duration = Math.floor((endTime - timeLog.startTime) / 1000);
    
    await timeLog.update({ endTime, duration });
    res.json(timeLog);
  } catch (error) {
    console.error('Stop tracking error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTimeLogs = async (req, res) => {
  try {
    const timeLogs = await TimeLog.findAll({
      where: { userId: req.userId },
      include: [{ 
        model: Task, 
        attributes: ['id', 'title', 'status'],
        required: false // Use LEFT JOIN instead of INNER JOIN
      }],
      order: [['startTime', 'DESC']]
    });
    res.json(timeLogs);
  } catch (error) {
    console.error('Get time logs error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getDailySummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const timeLogs = await TimeLog.findAll({
      where: {
        userId: req.userId,
        startTime: { [Op.gte]: today }
      },
      include: [{ 
        model: Task,
        required: false
      }]
    });
    
    const tasks = await Task.findAll({
      where: {
        userId: req.userId,
        updatedAt: { [Op.gte]: today }
      }
    });
    
    const totalTime = timeLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const completedTasks = tasks.filter(t => t.status === 'Completed');
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
    const pendingTasks = tasks.filter(t => t.status === 'Pending');
    
    res.json({
      totalTime,
      tasksWorkedOn: timeLogs.length,
      completedTasks: completedTasks.length,
      inProgressTasks: inProgressTasks.length,
      pendingTasks: pendingTasks.length,
      tasks: tasks,
      timeLogs: timeLogs
    });
  } catch (error) {
    console.error('Get daily summary error:', error);
    res.status(500).json({ error: error.message });
  }
};
