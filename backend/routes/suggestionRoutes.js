const express = require('express');
const router = express.Router();
const Suggestion = require('../models/suggestionModel');
const { crud } = require('../controllers/basicCrudFactory');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const c = crud(Suggestion);
router.get('/', c.list);
router.post('/', c.create); // allow public submissions
router.put('/:id', protect, adminOnly, c.update);
router.delete('/:id', protect, adminOnly, c.remove);
module.exports = router;
