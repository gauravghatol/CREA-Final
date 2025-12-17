const express = require('express');
const router = express.Router();
const { requestOtp, verifyOtp, refreshAccessToken, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', protect, logout);

module.exports = router;
