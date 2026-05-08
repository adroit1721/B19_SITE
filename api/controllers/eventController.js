const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { Parser } = require('json2csv');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const events = await Event.find(filter).sort({ date: -1 });
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get active event (for homepage banner)
// @route   GET /api/events/active
// @access  Public
const getActiveEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ status: 'active' }).sort({ createdAt: -1 });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.admin._id });
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    await Registration.deleteMany({ event: req.params.id });
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Public
const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.status !== 'active') return res.status(400).json({ success: false, message: 'Registration is not open for this event' });

    const { formData } = req.body;
    if (!formData) return res.status(400).json({ success: false, message: 'Form data is required' });

    // Extract name, email, phone from formData for quick display
    const getVal = (patterns) => {
      for (const p of patterns) {
        const key = Object.keys(formData).find(k => k.toLowerCase().includes(p.toLowerCase()));
        if (key && formData[key]) return formData[key];
      }
      return null;
    };

    const name = getVal(['name', 'full', 'participant', 'member']) || 'Anonymous';
    const email = getVal(['email', 'mail']) || '';
    const phone = getVal(['phone', 'mobile', 'cell', 'contact', 'whatsapp']) || '';

    // Check max participants
    if (event.maxParticipants > 0) {
      const count = await Registration.countDocuments({ event: event._id });
      if (count >= event.maxParticipants) {
        return res.status(400).json({ success: false, message: 'Event is fully booked' });
      }
    }

    const registration = await Registration.create({
      event: event._id,
      formData,
      name,
      email,
      phone,
    });

    res.status(201).json({ success: true, data: registration, message: 'Registration successful!' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get registrations for an event
// @route   GET /api/events/:id/registrations
// @access  Private
const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: registrations, count: registrations.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recent participants (public - for social proof)
// @route   GET /api/events/:id/participants
// @access  Public
const getRecentParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    let query = Registration.find({ event: req.params.id }).sort({ createdAt: -1 }).limit(100);
    
    // If admin enabled public data, include formData, otherwise just basic info
    if (event.showPublicData) {
      query = query.select('name phone registeredAt status formData');
    } else {
      query = query.select('name phone registeredAt status');
    }

    const participants = await query;
    res.json({ success: true, data: participants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download registrations as CSV
// @route   GET /api/events/:id/registrations/csv
// @access  Private
const downloadCSV = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const registrations = await Registration.find({ event: req.params.id }).sort({ createdAt: -1 });

    if (registrations.length === 0) {
      return res.status(400).json({ success: false, message: 'No registrations found' });
    }

    // Build CSV rows from dynamic formData
    const rows = registrations.map((reg, idx) => {
      const formObj = {};
      if (reg.formData instanceof Map) {
        reg.formData.forEach((val, key) => { formObj[key] = val; });
      } else {
        Object.assign(formObj, reg.formData);
      }
      return {
        '#': idx + 1,
        'Registration ID': reg._id.toString(),
        'Name': reg.name,
        'Email': reg.email,
        'Phone': reg.phone,
        'Status': reg.status,
        'Registered At': new Date(reg.registeredAt).toLocaleString(),
        ...formObj,
      };
    });

    const parser = new Parser();
    const csv = parser.parse(rows);

    const filename = `${event.title.replace(/\s+/g, '_')}_registrations.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
