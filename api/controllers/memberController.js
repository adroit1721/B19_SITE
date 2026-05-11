const Member = require('../models/Member');

// @desc    Get all members
// @route   GET /api/members
// @access  Public
const getMembers = async (req, res) => {
  try {
    const { group, search, page = 1, limit = 20 } = req.query;
    const filter = { isPublic: true, status: 'approved' };
    
    if (group) filter.group = group;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { occupation: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const members = await Member.find(filter)
      .sort({ order: 1, name: 1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Member.countDocuments(filter);

    res.json({ 
      success: true, 
      data: members, 
      total, 
      page: Number(page), 
      totalPages: Math.ceil(total / limit) 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all members (admin)
// @route   GET /api/members/admin
// @access  Private
const getMembersAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const members = await Member.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: members, count: members.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create member (Admin)
// @route   POST /api/members
// @access  Private
const createMember = async (req, res) => {
  try {
    const member = await Member.create({ 
      ...req.body, 
      createdBy: req.admin._id,
      status: 'approved' // Admin created members are approved by default
    });
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Register member (Public)
// @route   POST /api/members/register
// @access  Public
const registerMember = async (req, res) => {
  try {
    const member = await Member.create({ 
      ...req.body, 
      status: 'pending' // Self-registered members are pending
    });
    res.status(201).json({ 
      success: true, 
      message: 'Registration successful! Waiting for admin approval.',
      data: member 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private
const updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private
const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMembers,
  getMembersAdmin,
  createMember,
  registerMember,
  updateMember,
  deleteMember,
};
