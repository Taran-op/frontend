const mongoose = require('mongoose');

const usageLogSchema = new mongoose.Schema({
  apiKey: {
    type: String,
    required: true,
    index: true,
  },
  apiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'API',
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    required: true,
  },
  statusCode: {
    type: Number,
    required: true,
  },
  responseTime: {
    type: Number, // in milliseconds
    required: true,
  },
  requestBody: {
    type: Object,
  },
  responseBody: {
    type: Object,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
usageLogSchema.index({ apiKey: 1, createdAt: -1 });
usageLogSchema.index({ apiId: 1, createdAt: -1 });

module.exports = mongoose.model('UsageLog', usageLogSchema);