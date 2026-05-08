const Footer = require('../models/Footer');

// @desc    Get footer data
// @route   GET /api/footer
// @access  Public
const getFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne({ isActive: true });
    if (!footer) {
      footer = await Footer.create({});
    }
    res.json({ success: true, data: footer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update footer data
// @route   PUT /api/footer
// @access  Private
const updateFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne({ isActive: true });
    if (!footer) {
      footer = await Footer.create(req.body);
    } else {
      Object.assign(footer, req.body);
      await footer.save();
    }
    res.json({ success: true, data: footer, message: 'Footer updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getFooter, updateFooter };
