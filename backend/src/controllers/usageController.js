const UsageLog = require('../models/UsageLog');
const APIKey = require('../models/APIKey');
const API = require('../models/API');
const Billing = require('../models/Billing');

const logUsage = async (req, res) => {
  try {
    const {
      apiKey,
      endpoint,
      method,
      statusCode,
      responseTime,
      requestBody,
      responseBody,
    } = req.body;

    // Find API key
    const keyDoc = await APIKey.findOne({ key: apiKey, status: 'active' });
    if (!keyDoc) {
      return res.status(401).json({ message: 'Invalid or revoked API key' });
    }

    // Check if key is expired
    if (keyDoc.expiresAt && new Date(keyDoc.expiresAt) < new Date()) {
      return res.status(401).json({ message: 'API key expired' });
    }

    // Get API details
    const api = await API.findById(keyDoc.apiId);
    if (!api || !api.isActive) {
      return res.status(404).json({ message: 'API not found or inactive' });
    }

    // Create usage log
    const usageLog = new UsageLog({
      apiKey,
      apiId: keyDoc.apiId,
      endpoint,
      method,
      statusCode,
      responseTime,
      requestBody,
      responseBody,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    await usageLog.save();

    // Update last used timestamp
    keyDoc.lastUsed = new Date();
    await keyDoc.save();

    res.status(201).json({
      message: 'Usage logged successfully',
      logId: usageLog._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsageLogs = async (req, res) => {
  try {
    const { apiId } = req.params;
    const { page = 1, limit = 50, startDate, endDate } = req.query;
    const userId = req.user.userId;

    // Verify API belongs to user
    const api = await API.findOne({ _id: apiId, userId });
    if (!api) {
      return res.status(404).json({ message: 'API not found' });
    }

    // Build query
    const query = { apiId };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await UsageLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await UsageLog.countDocuments(query);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsageStats = async (req, res) => {
  try {
    const { apiId } = req.params;
    const { period = '24h' } = req.query;
    const userId = req.user.userId;

    // Verify API belongs to user
    const api = await API.findOne({ _id: apiId, userId });
    if (!api) {
      return res.status(404).json({ message: 'API not found' });
    }

    // Calculate date range
    let startDate = new Date();
    switch (period) {
      case '1h':
        startDate.setHours(startDate.getHours() - 1);
        break;
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setHours(startDate.getHours() - 24);
    }

    // Get usage stats
    const stats = await UsageLog.aggregate([
      {
        $match: {
          apiId: api._id,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          avgResponseTime: { $avg: '$responseTime' },
          successCount: {
            $sum: { $cond: [{ $lt: ['$statusCode', 400] }, 1, 0] },
          },
          errorCount: {
            $sum: { $cond: [{ $gte: ['$statusCode', 400] }, 1, 0] },
          },
        },
      },
    ]);

    // Get hourly breakdown
    const hourlyStats = await UsageLog.aggregate([
      {
        $match: {
          apiId: api._id,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d %H', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      stats: stats[0] || { totalRequests: 0, avgResponseTime: 0, successCount: 0, errorCount: 0 },
      hourlyStats,
      period,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBillingInfo = async (req, res) => {
  try {
    const { apiId } = req.params;
    const { billingPeriod } = req.query;
    const userId = req.user.userId;

    // Verify API belongs to user
    const api = await API.findOne({ _id: apiId, userId });
    if (!api) {
      return res.status(404).json({ message: 'API not found' });
    }

    // Get or create billing record
    let billing = await Billing.findOne({
      apiId,
      billingPeriod: billingPeriod || new Date().toISOString().slice(0, 7),
    });

    if (!billing) {
      billing = new Billing({
        userId,
        apiId,
        billingPeriod: billingPeriod || new Date().toISOString().slice(0, 7),
      });
      await billing.save();
    }

    // Get usage count for the period
    const usageCount = await UsageLog.countDocuments({
      apiId,
      createdAt: {
        $gte: new Date(`${billingPeriod || new Date().toISOString().slice(0, 7)}-01`),
        $lt: new Date(`${billingPeriod || new Date().toISOString().slice(0, 7)}-31`),
      },
    });

    // Calculate billing
    const freeRequests = 1000;
    const chargedRequests = Math.max(0, usageCount - freeRequests);
    const totalAmount = (chargedRequests / 100) * 0.5;

    res.json({
      billingPeriod: billing.billingPeriod,
      totalRequests: usageCount,
      freeRequests,
      chargedRequests,
      ratePerHundred: 0.5,
      totalAmount: totalAmount.toFixed(2),
      status: billing.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  logUsage,
  getUsageLogs,
  getUsageStats,
  getBillingInfo,
};