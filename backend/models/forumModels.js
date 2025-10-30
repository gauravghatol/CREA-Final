const mongoose = require('mongoose');

const forumTopicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    createdAtStr: { type: String },
    replies: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const forumPostSchema = new mongoose.Schema(
  {
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumTopic', required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
    createdAtStr: { type: String },
    // track user ids who liked this post (store as strings to avoid coupling)
    likedBy: [{ type: String }],
    // simple nested comments stored on a post
    comments: [
      {
        author: { type: String, required: true },
        content: { type: String, required: true },
        createdAtStr: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = {
  ForumTopic: mongoose.model('ForumTopic', forumTopicSchema),
  ForumPost: mongoose.model('ForumPost', forumPostSchema),
};
