const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const {
  getGallery,
  getGalleryAdmin,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');

const upload = multer({ storage });

// Public routes
router.get('/', getGallery);

// Admin routes
router.get('/admin', protect, getGalleryAdmin);
router.post('/', protect, upload.single('file'), createGalleryItem);
router.put('/:id', protect, updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

module.exports = router;
