const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const User = require('./models/User');
const Task = require('./models/Task');
const TimeLog = require('./models/TimeLog');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const timelogRoutes = require('./routes/timelogs');

const app = express();



// Add your Netlify URL to allowed origins
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://task-tracker239.netlify.app' 
  ],
  credentials: true
};

app.use(cors(corsOptions));


// Define associations with CASCADE delete
User.hasMany(Task, { 
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

User.hasMany(TimeLog, { 
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

Task.belongsTo(User, { 
  foreignKey: 'userId'
});

Task.hasMany(TimeLog, { 
  foreignKey: 'taskId',
  onDelete: 'CASCADE' // When task is deleted, delete all its time logs
});

TimeLog.belongsTo(User, { 
  foreignKey: 'userId'
});

TimeLog.belongsTo(Task, { 
  foreignKey: 'taskId'
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/timelogs', timelogRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Task Tracker API' });
});

const PORT = process.env.PORT || 5000;

// Add error handling for database connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
    return sequelize.sync();
  })
  .then(() => {
    console.log('✅ Database synced');
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
  process.exit(1);
});
