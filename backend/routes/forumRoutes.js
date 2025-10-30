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
// Get posts for a topic. Returns posts including like counts and comments.
router.get('/topics/:id/posts', async (req, res) => {
  try {
    const items = await ForumPost.find({ topicId: req.params.id }).sort({ createdAt: 1 });
    // map to include derived fields for frontend convenience
    const mapped = items.map(p => ({
      _id: p._id,
      author: p.author,
      content: p.content,
      createdAt: p.createdAt,
      createdAtStr: p.createdAtStr,
      likesCount: Array.isArray(p.likedBy) ? p.likedBy.length : 0,
      comments: Array.isArray(p.comments) ? p.comments : [],
    }));
    return res.json(mapped);
  }
  catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

// Members can post replies (protected). Previously this required adminOnly — allow authenticated members.
router.post('/topics/:id/posts', protect, async (req, res) => {
  try {
    const post = await ForumPost.create({ topicId: req.params.id, author: req.body.author || (req.user?.name || 'Member'), content: req.body.content, createdAtStr: req.body.createdAt });
    await ForumTopic.findByIdAndUpdate(req.params.id, { $inc: { replies: 1 } });
    return res.status(201).json(post);
  } catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

// Toggle like/unlike for a post by the authenticated user
router.post('/topics/:topicId/posts/:postId/like', protect, async (req, res) => {
  try {
    const { postId } = req.params
    const userId = req.user && (req.user._id ? String(req.user._id) : String(req.user.id || ''))
    if (!userId) return res.status(401).json({ message: 'Not authorized' })
    const post = await ForumPost.findById(postId)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    post.likedBy = post.likedBy || []
    const idx = post.likedBy.indexOf(userId)
    let liked = false
    if (idx === -1) {
      post.likedBy.push(userId)
      liked = true
    } else {
      post.likedBy.splice(idx, 1)
      liked = false
    }
    await post.save()
    return res.json({ likesCount: post.likedBy.length, liked })
  } catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

// Add a comment to a post (nested comment)
router.post('/topics/:topicId/posts/:postId/comments', protect, async (req, res) => {
  try {
    const { postId } = req.params
    const post = await ForumPost.findById(postId)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    const author = req.body.author || (req.user?.name || 'Member')
    const content = req.body.content
    if (!content || !content.trim()) return res.status(400).json({ message: 'Content required' })
    const comment = { author, content, createdAtStr: req.body.createdAt }
    post.comments = post.comments || []
    post.comments.push(comment)
    await post.save()
    return res.status(201).json(comment)
  } catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

// Delete a post (author or admin only)
router.delete('/topics/:topicId/posts/:postId', protect, async (req, res) => {
  try {
    const { topicId, postId } = req.params
    const post = await ForumPost.findById(postId)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    
    // Check if user is admin or the author
    const isAdmin = req.user?.role === 'admin'
    const isAuthor = post.author === req.user?.name
    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ message: 'Not authorized to delete this post' })
    }
    
    await ForumPost.findByIdAndDelete(postId)
    await ForumTopic.findByIdAndUpdate(topicId, { $inc: { replies: -1 } })
    return res.json({ success: true })
  } catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

// Delete a comment from a post (comment author or admin only)
router.delete('/topics/:topicId/posts/:postId/comments/:commentIndex', protect, async (req, res) => {
  try {
    const { postId, commentIndex } = req.params
    const post = await ForumPost.findById(postId)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    
    const idx = parseInt(commentIndex, 10)
    if (isNaN(idx) || idx < 0 || idx >= (post.comments || []).length) {
      return res.status(404).json({ message: 'Comment not found' })
    }
    
    const comment = post.comments[idx]
    const isAdmin = req.user?.role === 'admin'
    const isAuthor = comment.author === req.user?.name
    
    if (!isAdmin && !isAuthor) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' })
    }
    
    post.comments.splice(idx, 1)
    await post.save()
    return res.json({ success: true })
  } catch (e) { console.error(e); return res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
