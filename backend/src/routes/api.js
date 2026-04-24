const express = require('express');
const router = express.Router();
const { 
  createAPI, 
  getAPIs, 
  getAPI, 
  updateAPI, 
  deleteAPI,
  createAPIKey,
  revokeAPIKey,
  rotateAPIKey,
} = require('../controllers/apiController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// API Management
router.post('/', createAPI);
router.get('/', getAPIs);
router.get('/:id', getAPI);
router.put('/:id', updateAPI);
router.delete('/:id', deleteAPI);

// API Key Management
router.post('/:id/keys', createAPIKey);
router.put('/:id/keys/:keyId/revoke', revokeAPIKey);
router.post('/:id/keys/:keyId/rotate', rotateAPIKey);

module.exports = router;