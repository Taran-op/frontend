const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const apiKeySchema = new mongoose.Schema({
  apiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'API',
    required: true,
  },
  key: {
    type: String,
    unique: true,
    default: () => `mf_${uuidv4().replace(/-/g, '')}`,
  },
  name: {
    type: String,
    default: 'Default Key',
  },
  status: {
    type: String,
    enum: ['active', 'revoked', 'expired'],
    default: 'active',
  },
  rateLimit: {
    type: Number,
    default: 1000, // requests per hour
  },
  lastUsed: {
    type: Date,
    default: null,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('APIKey', apiKeySchema);