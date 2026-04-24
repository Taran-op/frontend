const express = require('express');
const router = express.Router();
const { apiGateway, proxyRequest } = require('../controllers/gatewayController');

// API Gateway route - the core feature
// All requests go through this gateway
router.use('/', apiGateway, proxyRequest);

module.exports = router;