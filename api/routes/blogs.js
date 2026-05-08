const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogsAdmin,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getBlogs);
router.get('/admin', protect, getBlogsAdmin);
router.get('/:slug', getBlog);

// Admin routes
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
