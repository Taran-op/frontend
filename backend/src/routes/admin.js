const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Get all users (admin only)
router.get('/users', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const users = await User.find().select('-password -refreshToken');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role (admin only)
router.put('/users/:userId/role', auth, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { role } = req.body;
    if (!['api_owner', 'consumer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Only api_owner or consumer allowed.' });
    }

    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent demoting yourself
    if (targetUser._id.toString() === admin._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    targetUser.role = role;
    await targetUser.save();

    res.json({ 
      message: 'User role updated successfully',
      user: { id: targetUser._id, name: targetUser.name, email: targetUser.email, role: targetUser.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user (admin only)
router.delete('/users/:userId', auth, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' );
    }

    // Prevent deleting yourself
    if (targetUser._id.toString() === admin._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;