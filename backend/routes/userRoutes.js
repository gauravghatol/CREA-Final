const express = require('express');
const router = express.Router();
const { registerUser, loginUser, listUsers, updateUser } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin member management
router.get('/', protect, adminOnly, listUsers);
router.put('/:id', protect, adminOnly, updateUser);

module.exports = router;
