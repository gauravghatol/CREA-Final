const mongoose = require('mongoose');

const charterDemandSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String },
    content: { type: String },
    pdfUrl: { type: String },
    fileName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CharterDemand', charterDemandSchema);
