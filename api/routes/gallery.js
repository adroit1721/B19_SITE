const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getGallery,
  getGalleryAdmin,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');

// Use memory storage - Vercel filesystem is read-only
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Public routes
router.get('/', getGallery);

// Admin routes
router.get('/admin', protect, getGalleryAdmin);
router.post('/', protect, upload.single('file'), createGalleryItem);
router.put('/:id', protect, updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

module.exports = router;
