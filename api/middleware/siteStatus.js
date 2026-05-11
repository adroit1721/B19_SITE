const Settings = require('../models/Settings');

const checkSiteStatus = async (req, res, next) => {
  try {
    // Skip status check for admin routes and health check
    if (req.path.startsWith('/api/auth') || req.path.startsWith('/api/health') || req.path.includes('/admin')) {
      return next();
    }

    const settings = await Settings.findOne();
    if (settings && !settings.isSitePublic) {
      return res.status(503).json({
        success: false,
        message: settings.maintenanceMessage || 'Site is under maintenance',
        maintenanceMode: true
      });
    }
    next();
  } catch (error) {
    next(); // Fallback to next if settings fetch fails
  }
};

module.exports = checkSiteStatus;
