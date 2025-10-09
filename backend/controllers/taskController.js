const Task = require('../models/Task');
const { enhanceTaskWithAI } = require('../utils/aiHelper');

exports.createTask = async (req, res) => {
  try {
    const { input, useAI } = req.body;
    
    if (!input || input.trim() === '') {
      return res.status(400).json({ error: 'Task input is required' });
    }
    
    let title = input;
    let description = '';
    
    if (useAI) {
      try {
        const aiResult = await enhanceTaskWithAI(input);
        title = aiResult.title;
        description = aiResult.description;
      } catch (aiError) {
        console.error('AI enhancement failed:', aiError);
        // Continue with original input if AI fails
      }
    }
    
    const task = await Task.create({
      title,
      description,
      userId: req.userId
    });
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    
    const task = await Task.findOne({ where: { id, userId: req.userId } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await task.update({ 
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      status: status || task.status
    });
    
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ where: { id, userId: req.userId } });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: error.message });
  }
};
