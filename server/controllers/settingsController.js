const Settings = require('../models/Settings');

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }
    
    const { siteName, logoUrl, faviconUrl } = req.body;
    if (siteName) settings.siteName = siteName;
    if (logoUrl) settings.logoUrl = logoUrl;
    if (faviconUrl) settings.faviconUrl = faviconUrl;
    
    settings.updatedBy = req.admin._id;
    await settings.save();
    
    res.json({ success: true, data: settings, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
