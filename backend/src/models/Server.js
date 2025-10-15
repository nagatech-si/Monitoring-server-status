import mongoose from 'mongoose';

const serverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },

  status: {
    type: String,
  enum: ['operational', 'performaissue', 'down', 'maintenance'],
    default: 'operational'
  },
  responseTime: {
    type: Number,
    default: 0
  },
  uptime: {
    type: Number,
    default: 100
  },
  lastChecked: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Server = mongoose.model('Server', serverSchema, 'tm_server');

export default Server;
