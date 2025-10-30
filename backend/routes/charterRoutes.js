const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/upload');
const controller = require('../controllers/charterDemandController');

const router = express.Router();

router.get('/', controller.listCharters);
router.get('/all', protect, adminOnly, controller.listAllCharters);
router.get('/:id', controller.getCharter);
router.post('/', protect, adminOnly, uploadSingle('charters'), controller.createCharter);
router.put('/:id', protect, adminOnly, uploadSingle('charters'), controller.updateCharter);
router.delete('/:id', protect, adminOnly, controller.deleteCharter);

module.exports = router;
