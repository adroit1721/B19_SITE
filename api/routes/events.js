const express = require('express');
const router = express.Router();
const {
  getEvents,
  getActiveEvent,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getRegistrations,
  getRecentParticipants,
  downloadCSV,
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getEvents);
router.get('/active', getActiveEvent);
router.get('/:id', getEvent);
router.post('/:id/register', registerForEvent);
router.get('/:id/participants', getRecentParticipants);

// Admin protected routes
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.get('/:id/registrations', protect, getRegistrations);
router.get('/:id/registrations/csv', protect, downloadCSV);

module.exports = router;
