const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  startTracking,
  stopTracking,
  getTimeLogs,
  getDailySummary
} = require('../controllers/timelogController');

router.use(authMiddleware);

router.post('/start', startTracking);
router.put('/stop/:id', stopTracking);
router.get('/', getTimeLogs);
router.get('/daily-summary', getDailySummary);

module.exports = router;
