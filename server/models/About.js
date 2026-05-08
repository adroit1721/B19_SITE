const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: "We Are the Backbenchers" },
    heroSubtitle: { type: String, default: "SSC Batch-2019 | Rajabari Hat High School" },
    story: { type: String, default: "We were the ones who sat at the back, dreamed big, and changed the world in our own way..." },
    mission: { type: String, default: "" },
    vision: { type: String, default: "" },
    teamMembers: [
      {
        name: { type: String },
        role: { type: String },
        photo: { type: String },
        bio: { type: String },
        social: {
          facebook: { type: String, default: "" },
          instagram: { type: String, default: "" },
        },
      },
    ],
    stats: [
      {
        label: { type: String },
        value: { type: String },
        icon: { type: String },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('About', AboutSchema);
