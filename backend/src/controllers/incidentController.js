import Incident from '../models/Incident.js';

export const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ startTime: -1 });
    res.json({ success: true, data: incidents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createIncident = async (req, res) => {
  try {
    const incident = await Incident.create(req.body);
    res.status(201).json({ success: true, data: incident });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateIncident = async (req, res) => {
  try {
    const incident = await Incident.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }
    res.json({ success: true, data: incident });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteIncident = async (req, res) => {
  try {
    const incident = await Incident.findByIdAndDelete(req.params.id);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }
    res.json({ success: true, message: 'Incident deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
