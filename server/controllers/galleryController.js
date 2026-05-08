const Gallery = require('../models/Gallery');
const path = require('path');
const fs = require('fs');

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGallery = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { isPublished: true };
    if (type) filter.type = type;

    const items = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all gallery items (admin)
// @route   GET /api/gallery/admin
// @access  Private
const getGalleryAdmin = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items, count: items.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload gallery item
// @route   POST /api/gallery
// @access  Private
const createGalleryItem = async (req, res) => {
  try {
    const { title, type, description, tags, event, order } = req.body;

    let url = req.body.url || '';
    let thumbnail = req.body.thumbnail || '';

    if (req.file) {
      url = `/uploads/${req.file.filename}`;
      thumbnail = url;
    }

    const item = await Gallery.create({
      title,
      type,
      url,
      thumbnail,
      description,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : [],
      event: event || null,
      order: order || 0,
      uploadedBy: req.admin._id,
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private
const updateGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private
const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });

    // Delete file if local upload
    if (item.url && item.url.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', 'public', item.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getGallery, getGalleryAdmin, createGalleryItem, updateGalleryItem, deleteGalleryItem };
