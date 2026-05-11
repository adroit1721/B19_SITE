const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: "Backbencher's 19" },
  logoUrl: { type: String, default: '/images/logo.png' },
  faviconUrl: { type: String, default: '/images/favicon.ico' },
  isSitePublic: { type: Boolean, default: true },
  maintenanceMessage: { type: String, default: "Site is under maintenance. We will be back soon!" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
