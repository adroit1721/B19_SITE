const express = require('express');
const router = express.Router();
const { loginAdmin, getMe, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', loginAdmin);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

module.exports = router;
