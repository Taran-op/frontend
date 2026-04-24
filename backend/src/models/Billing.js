const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  apiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'API',
    required: true,
  },
  totalRequests: {
    type: Number,
    default: 0,
  },
  freeRequests: {
    type: Number,
    default: 1000, // Free tier limit
  },
  chargedRequests: {
    type: Number,
    default: 0,
  },
  ratePerHundred: {
    type: Number,
    default: 0.5, // ₹0.5 per 100 requests
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending',
  },
  billingPeriod: {
    type: String, // e.g., "2024-01"
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Billing', billingSchema);