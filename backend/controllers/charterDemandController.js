const asyncHandler = require('express-async-handler');
const CharterDemand = require('../models/charterDemandModel');

const parseBoolean = (value, defaultValue = true) => {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  }
  return defaultValue;
};

const parseNumber = (value, fallback = 0) => {
  if (value === undefined || value === null) return fallback;
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

exports.listCharters = asyncHandler(async (_req, res) => {
  const docs = await CharterDemand.find({ published: true }).sort({ order: 1, createdAt: -1 });
  res.json(docs);
});

exports.listAllCharters = asyncHandler(async (_req, res) => {
  const docs = await CharterDemand.find().sort({ order: 1, createdAt: -1 });
  res.json(docs);
});

exports.getCharter = asyncHandler(async (req, res) => {
  const doc = await CharterDemand.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
});

exports.createCharter = asyncHandler(async (req, res) => {
  const { title, summary, content } = req.body || {};
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const doc = new CharterDemand({
    title,
    summary,
    content,
    order: parseNumber(req.body?.order, 0),
    published: parseBoolean(req.body?.published, true),
  });

  if (req.file) {
    doc.fileName = req.file.filename;
    doc.mimeType = req.file.mimetype;
    doc.size = req.file.size;
    doc.pdfUrl = `/uploads/charters/${req.file.filename}`;
  }

  const created = await doc.save();
  res.status(201).json(created);
});

exports.updateCharter = asyncHandler(async (req, res) => {
  const doc = await CharterDemand.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Not found' });

  if (typeof req.body?.title === 'string') doc.title = req.body.title;
  if (req.body?.summary !== undefined) doc.summary = req.body.summary;
  if (req.body?.content !== undefined) doc.content = req.body.content;
  if (req.body?.order !== undefined) doc.order = parseNumber(req.body.order, doc.order);
  if (req.body?.published !== undefined) doc.published = parseBoolean(req.body.published, doc.published);

  if (req.file) {
    doc.fileName = req.file.filename;
    doc.mimeType = req.file.mimetype;
    doc.size = req.file.size;
    doc.pdfUrl = `/uploads/charters/${req.file.filename}`;
  }

  const updated = await doc.save();
  res.json(updated);
});

exports.deleteCharter = asyncHandler(async (req, res) => {
  const doc = await CharterDemand.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Not found' });
  await doc.deleteOne();
  res.status(204).send();
});
