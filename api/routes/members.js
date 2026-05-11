const express = require('express');
const router = express.Router();
const {
  getMembers,
  getMembersAdmin,
  createMember,
  registerMember,
  updateMember,
  deleteMember,
} = require('../controllers/memberController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getMembers);
router.post('/register', registerMember);

// Admin routes
router.get('/admin', protect, getMembersAdmin);
router.post('/', protect, createMember);
router.put('/:id', protect, updateMember);
router.delete('/:id', protect, deleteMember);

module.exports = router;
