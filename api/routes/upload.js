const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');

// Use memory storage - Vercel filesystem is read-only
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  // Convert to base64 data URL since Vercel has read-only filesystem
  const base64 = req.file.buffer.toString('base64');
  const url = `data:${req.file.mimetype};base64,${base64}`;
  res.json({ success: true, url });
});

module.exports = router;
