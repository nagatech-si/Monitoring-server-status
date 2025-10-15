import Server from '../models/Server.js';
import StatusHistory from '../models/StatusHistory.js';
import axios from 'axios';

// Get all servers
export const getAllServers = async (req, res) => {
  try {
    const servers = await Server.find()
      .populate('groupId', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: servers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single server
export const getServer = async (req, res) => {
  try {
    const server = await Server.findById(req.params.id).populate('groupId', 'name');
    if (!server) {
      return res.status(404).json({ success: false, message: 'Server not found' });
    }
    res.json({ success: true, data: server });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new server
export const createServer = async (req, res) => {
  try {
    const server = await Server.create(req.body);
    res.status(201).json({ success: true, data: server });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update server
export const updateServer = async (req, res) => {
  try {
    const server = await Server.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!server) {
      return res.status(404).json({ success: false, message: 'Server not found' });
    }
    res.json({ success: true, data: server });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete server
export const deleteServer = async (req, res) => {
  try {
    const server = await Server.findByIdAndDelete(req.params.id);
    if (!server) {
      return res.status(404).json({ success: false, message: 'Server not found' });
    }
    // Delete related history
    await StatusHistory.deleteMany({ serverId: req.params.id });
    res.json({ success: true, message: 'Server deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check server status (ping)
export const checkServerStatus = async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);
    if (!server) {
      return res.status(404).json({ success: false, message: 'Server not found' });
    }

    const startTime = Date.now();
    let status = 'operational';
    let responseTime = 0;
    let errorMessage = '';

    try {
      const response = await axios.get(server.url, { timeout: 5000 });
      responseTime = Date.now() - startTime;

      if (response.status >= 200 && response.status < 300) {
        status = 'operational';
      } else if (response.status >= 300 && response.status < 500) {
  status = 'performaissue';
      }
    } catch (error) {
      responseTime = Date.now() - startTime;
      status = 'down';
      errorMessage = error.message;
    }

    // Update server
    server.status = status;
    server.responseTime = responseTime;
    server.lastChecked = new Date();
    await server.save();

    // Save history
    await StatusHistory.create({
      serverId: server._id,
      status,
      responseTime,
      errorMessage
    });

    res.json({ success: true, data: server });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get server status history
export const getServerHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50 } = req.query;

    const history = await StatusHistory.find({ serverId: id })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
