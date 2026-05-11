const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

const upload = multer({ storage });

router.post('/', protect, upload.single('file'), (req, res) => {
  console.log('Upload Request Received');
  if (!req.file) {
    console.log('❌ No file in request');
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  
  console.log('✅ File uploaded to Cloudinary:', req.file.path);
  // Return the Cloudinary secure URL
  res.json({ 
    success: true, 
    url: req.file.path || req.file.secure_url 
  });
});

module.exports = router;
