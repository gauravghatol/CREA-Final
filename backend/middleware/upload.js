const multer = require('multer');
const path = require('path');
const fs = require('fs');

function ensureDir(dirPath) {
  try { fs.mkdirSync(dirPath, { recursive: true }); } catch {}
}

function storageFor(subdir) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dest = path.join(__dirname, '..', 'uploads', subdir);
      ensureDir(dest);
      cb(null, dest);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '').toLowerCase();
      const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, name);
    },
  });
}

function fileFilter(_req, file, cb) {
  const ok = file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/');
  if (!ok) return cb(new Error('Only images or PDF allowed'));
  return cb(null, true);
}

function isMultipart(req) {
  const header = (req.headers['content-type'] || '').toLowerCase();
  return header.startsWith('multipart/form-data');
}

exports.uploadSingle = (subdir, fieldName = 'file') => {
  const upload = multer({ storage: storageFor(subdir), fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }).single(fieldName);
  return (req, res, next) => {
    if (!isMultipart(req)) return next();
    upload(req, res, (err) => {
      if (err) return next(err);
      return next();
    });
  };
};
