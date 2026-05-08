const About = require('../models/About');

// @desc    Get about data
// @route   GET /api/about
// @access  Public
const getAbout = async (req, res) => {
  try {
    let about = await About.findOne({ isActive: true });
    if (!about) {
      about = await About.create({});
    }
    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update about data
// @route   PUT /api/about
// @access  Private
const updateAbout = async (req, res) => {
  try {
    let about = await About.findOne({ isActive: true });
    if (!about) {
      about = await About.create(req.body);
    } else {
      Object.assign(about, req.body);
      await about.save();
    }
    res.json({ success: true, data: about, message: 'About updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getAbout, updateAbout };
