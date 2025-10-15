import Group from '../models/Group.js';
import Server from '../models/Server.js';

// Get all groups
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });
    res.json({ success: true, data: groups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single group
export const getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    res.json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new group
export const createGroup = async (req, res) => {
  try {
    const group = await Group.create(req.body);
    res.status(201).json({ success: true, data: group });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Group name already exists' });
    } else {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

// Update group
export const updateGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    res.json({ success: true, data: group });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Group name already exists' });
    } else {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

// Delete group
export const deleteGroup = async (req, res) => {
  try {
    // Check if there are servers in this group
    const serversInGroup = await Server.countDocuments({ groupId: req.params.id });
    if (serversInGroup > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete group. There are ${serversInGroup} servers in this group.` 
      });
    }

    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    res.json({ success: true, message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get servers by group
export const getServersByGroup = async (req, res) => {
  try {
    const servers = await Server.find({ groupId: req.params.id })
      .populate('groupId', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: servers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};