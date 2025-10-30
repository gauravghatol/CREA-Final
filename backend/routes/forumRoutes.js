const express = require('express');
const router = express.Router();
const { ForumTopic, ForumPost } = require('../models/forumModels');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Topics
router.get('/topics', async (_req, res) => {
  try { const items = await ForumTopic.find().sort({ createdAt: -1 }); return res.json(items); }
  catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});
router.post('/topics', protect, adminOnly, async (req, res) => {
  try {
    const topic = await ForumTopic.create({ title: req.body.title, author: req.body.author || (req.user?.name || 'Member'), createdAtStr: req.body.createdAt });
    return res.status(201).json(topic);
  } catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});
router.put('/topics/:id', protect, adminOnly, async (req, res) => {
  try { const t = await ForumTopic.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators: true }); if(!t) return res.status(404).json({message:'Not found'}); return res.json(t); }
  catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});
router.delete('/topics/:id', protect, adminOnly, async (req, res) => {
  try { const t = await ForumTopic.findByIdAndDelete(req.params.id); if(!t) return res.status(404).json({message:'Not found'}); await ForumPost.deleteMany({ topicId: t._id }); return res.json({ success: true }); }
  catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

// Posts
router.get('/topics/:id/posts', async (req, res) => {
  try { const items = await ForumPost.find({ topicId: req.params.id }).sort({ createdAt: 1 }); return res.json(items); }
  catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});
router.post('/topics/:id/posts', protect, adminOnly, async (req, res) => {
  try {
    const post = await ForumPost.create({ topicId: req.params.id, author: req.body.author || (req.user?.name || 'Member'), content: req.body.content, createdAtStr: req.body.createdAt });
    await ForumTopic.findByIdAndUpdate(req.params.id, { $inc: { replies: 1 } });
    return res.status(201).json(post);
  } catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
