const mongoose = require('mongoose');

const FooterSchema = new mongoose.Schema(
  {
    schoolName: { type: String, default: "Rajabari Hat High School" },
    batchName: { type: String, default: "SSC Batch-2019" },
    groupName: { type: String, default: "Backbencher's 19" },
    tagline: { type: String, default: "Once a backbencher, always a legend." },
    description: { type: String, default: "A digital home for the SSC Batch-2019 graduates of Rajabari Hat High School. Reliving memories, celebrating milestones." },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "Rajabari Hat High School, Bangladesh" },
    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    quickLinks: [
      {
        label: { type: String },
        url: { type: String },
      },
    ],
    copyrightText: { type: String, default: `© ${new Date().getFullYear()} Backbencher's 19. All rights reserved.` },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Footer', FooterSchema);
