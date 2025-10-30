const express = require('express');
const router = express.Router();
const { 
  submitMembership, 
  listMemberships, 
  updateMembershipStatus,
  renewMembership,
  getMembershipStats
} = require('../controllers/membershipController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.post('/', protect, submitMembership);

// Protected routes (logged-in users)
router.get('/stats', protect, getMembershipStats);

// Admin routes
router.get('/', protect, adminOnly, listMemberships);
router.put('/:id/status', protect, adminOnly, updateMembershipStatus);
router.put('/:id/renew', protect, adminOnly, renewMembership);

module.exports = router;
