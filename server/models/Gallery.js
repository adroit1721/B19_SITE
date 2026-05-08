const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['photo', 'video'],
      required: true,
    },
    url: { type: String, required: true }, // File path or external URL
    thumbnail: { type: String, default: '' },
    description: { type: String, default: '' },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
    tags: [{ type: String }],
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', GallerySchema);
