const API = require('../models/API');
const APIKey = require('../models/APIKey');

const createAPI = async (req, res) => {
  try {
    const { name, description, baseUrl } = req.body;
    const userId = req.user.userId;

    const api = new API({
      userId,
      name,
      description,
      baseUrl,
    });

    await api.save();

    // Create a default API key
    const apiKey = new APIKey({ apiId: api._id });
    await apiKey.save();

    res.status(201).json({
      message: 'API created successfully',
      api: {
        ...api.toObject(),
        apiKeys: [{ key: apiKey.key, status: apiKey.status, name: apiKey.name }],
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAPIs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const apis = await API.find({ userId }).populate('apiKeys');

    res.json({ apis });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAPI = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const api = await API.findOne({ _id: id, userId }).populate('apiKeys');
    if (!api) {
      return res.status(404).json({ message: 'API not found' });
    }

    res.json({ api });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAPI = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, baseUrl, isActive } = req.body;
    const userId = req.user.userId;

    const api = await API.findOneAndUpdate(
      { _id: id, userId },
      { name, description, baseUrl, isActive },
      { new: true }
    );

    if (!api) {
      return res.status(404).json({ message: 'API not found' });
    }

    res.json({ message: 'API updated successfully', api });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAPI = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const api = await API.findOneAndDelete({ _id: id, userId });
    if (!api) {
      return res.status(404).json({ message: 'API not found' });
    }

    // Delete associated API keys
    await APIKey.deleteMany({ apiId: id });

    res.json({ message: 'API deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// API Key Management
const createAPIKey = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rateLimit, expiresAt } = req.body;
    const userId = req.user.userId;

    // Verify API belongs to user
    const api = await API.findOne({ _id: id, userId });
    if (!api) {
      return res.status(404).json({ message: 'API not found' });
    }

    const apiKey = new APIKey({
      apiId: id,
      name: name || 'New Key',
      rateLimit: rateLimit || 1000,
      expiresAt,
    });

    await apiKey.save();

    res.status(201).json({
      message: 'API key created successfully',
      apiKey: {
        key: apiKey.key,
        name: apiKey.name,
        status: apiKey.status,
        rateLimit: apiKey.rateLimit,
        expiresAt: apiKey.expiresAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const revokeAPIKey = async (req, res) => {
  try {
    const { id, keyId } = req.params;
    const userId = req.user.userId;

    // Verify API belongs to user
    const api = await API.findOne({ _id: id, userId });
    if (!api) {
      return res.status(404).json({ message: 'API not found' });
    }

    const apiKey = await APIKey.findOneAndUpdate(
      { _id: keyId, apiId: id },
      { status: 'revoked' },
      { new: true }
    );

    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    res.json({ message: 'API key revoked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rotateAPIKey = async (req, res) => {
  try {
    const { id, keyId } = req.params;
    const userId = req.user.userId;

    // Verify API belongs to user
    const api = await API.findOne({ _id: id, userId });
    if (!api) {
      return res.status(404).json({ message: 'API not found' });
    }

    // Revoke old key
    await APIKey.findOneAndUpdate(
      { _id: keyId, apiId: id },
      { status: 'revoked' }
    );

    // Create new key
    const newApiKey = new APIKey({ apiId: id });
    await newApiKey.save();

    res.status(201).json({
      message: 'API key rotated successfully',
      apiKey: {
        key: newApiKey.key,
        name: newApiKey.name,
        status: newApiKey.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAPI,
  getAPIs,
  getAPI,
  updateAPI,
  deleteAPI,
  createAPIKey,
  revokeAPIKey,
  rotateAPIKey,
};