const mongoose = require('mongoose');

// Custom form field schema (JSON-based dynamic form builder)
const FormFieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: {
    type: String,
    enum: ['text', 'email', 'phone', 'number', 'select', 'textarea', 'checkbox', 'date'],
    required: true,
  },
  placeholder: { type: String, default: '' },
  options: [{ type: String }], // For select fields
  required: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
});

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    coverImage: { type: String, default: '' },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    formSchema: [FormFieldSchema], // Dynamic form builder fields
    registrationDeadline: { type: Date },
    maxParticipants: { type: Number, default: 0 }, // 0 = unlimited
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
