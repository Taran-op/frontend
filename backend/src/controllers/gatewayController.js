const APIKey = require('../models/APIKey');
const API = require('../models/API');
const UsageLog = require('../models/UsageLog');
const redis = require('../config/redis');

// API Gateway - Core Feature
// Intercepts all requests, validates API key, applies rate limiting, logs usage, forwards request

const apiGateway = async (req, res, next) => {
  const startTime = Date.now();
  
  try {
    // Extract API key from header
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({ 
        error: 'API key required',
        message: 'Please provide an API key in X-API-Key header'
      });
    }

    // Find and validate API key
    const keyDoc = await APIKey.findOne({ key: apiKey, status: 'active' });
    if (!keyDoc) {
      return res.status(401).json({ 
        error: 'Invalid API key',
        message: 'The provided API key is invalid or has been revoked'
      });
    }

    // Check if key is expired
    if (keyDoc.expiresAt && new Date(keyDoc.expiresAt) < new Date()) {
      return res.status(401).json({ 
        error: 'API key expired',
        message: 'The API key has expired. Please generate a new key.'
      });
    }

    // Get API details
    const api = await API.findById(keyDoc.apiId);
    if (!api || !api.isActive) {
      return res.status(404).json({ 
        error: 'API not found',
        message: 'The associated API is not found or inactive'
      });
    }

    // Rate Limiting using Redis
    const rateLimitKey = `ratelimit:${keyDoc.key}`;
    const currentCount = await redis.incr(rateLimitKey);
    
    // Set expiry on first request
    if (currentCount === 1) {
      await redis.expire(rateLimitKey, 3600); // 1 hour window
    }

    // Check rate limit
    if (currentCount > keyDoc.rateLimit) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded',
        message: `You have exceeded the rate limit of ${keyDoc.rateLimit} requests per hour`,
        retryAfter: await redis.ttl(rateLimitKey)
      });
    }

    // Attach API info to request for downstream use
    req.apiInfo = {
      apiId: api._id,
      apiKey: keyDoc.key,
      apiName: api.name,
      baseUrl: api.baseUrl,
    };

    // Store original endpoint for logging
    req.originalUrl = req.originalUrl || req.url;

    // Override res.json to capture response
    const originalJson = res.json.bind(res);
    res.json = function (data) {
      const responseTime = Date.now() - startTime;
      
      // Log usage asynchronously (don't block response)
      logUsageAsync(req, res.statusCode, responseTime, data);
      
      return originalJson(data);
    };

    // Forward request to actual API
    next();
  } catch (error) {
    console.error('API Gateway Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'An error occurred while processing your request'
    });
  }
};

// Async logging function
const logUsageAsync = async (req, statusCode, responseTime, responseBody) => {
  try {
    if (!req.apiInfo) return;

    const usageLog = new UsageLog({
      apiKey: req.apiInfo.apiKey,
      apiId: req.apiInfo.apiId,
      endpoint: req.originalUrl,
      method: req.method,
      statusCode,
      responseTime,
      requestBody: req.body,
      responseBody,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    await usageLog.save();

    // Update last used timestamp
    await APIKey.findOneAndUpdate(
      { key: req.apiInfo.apiKey },
      { lastUsed: new Date() }
    );
  } catch (error) {
    console.error('Usage logging error:', error);
  }
};

// Proxy request to target API
const proxyRequest = async (req, res) => {
  try {
    const { baseUrl } = req.apiInfo;
    const targetUrl = `${baseUrl}${req.originalUrl}`;

    // Forward the request
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        'x-api-key': undefined,
        'host': new URL(baseUrl).host,
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(502).json({ 
      error: 'Bad gateway',
      message: 'Failed to forward request to target API'
    });
  }
};

module.exports = {
  apiGateway,
  proxyRequest,
};