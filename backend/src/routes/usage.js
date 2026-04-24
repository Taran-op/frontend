const express = require('express');
const router = express.Router();
const { 
  logUsage, 
  getUsageLogs, 
  getUsageStats,
  getBillingInfo,
} = require('../controllers/usageController');
const { auth } = require('../middleware/auth');

// Public route for logging (can be called by gateway)
router.post('/log', logUsage);

// Protected routes
router.get('/:apiId/logs', auth, getUsageLogs);
router.get('/:apiId/stats', auth, getUsageStats);
router.get('/:apiId/billing', auth, getBillingInfo);

module.exports = router;