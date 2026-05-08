const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    formData: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Stores dynamic form field responses
      required: true,
    },
    name: { type: String, required: true }, // Extracted for quick display
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    registeredAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Registration', RegistrationSchema);
