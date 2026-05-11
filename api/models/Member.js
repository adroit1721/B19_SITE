const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    studentId: { type: String, trim: true },
    batch: { type: String, default: '2019' },
    group: { type: String, enum: ['Science', 'Commerce', 'Arts', 'Other'], default: 'Science' },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    presentAddress: { type: String },
    permanentAddress: { type: String },
    occupation: { type: String },
    organization: { type: String },
    photoUrl: { type: String, default: '' },
    socialLinks: {
      facebook: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
    },
    isPublic: { type: Boolean, default: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
    order: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Member', MemberSchema);
