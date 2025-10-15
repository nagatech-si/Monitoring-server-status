import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  serverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Server',
    required: true
  },
  status: {
    type: String,
    enum: ['operational', 'performaissue', 'down', 'maintenance'],
    required: true
  },
  responseTime: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  errorMessage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const StatusHistory = mongoose.model('StatusHistory', statusHistorySchema ,'th_activity');

export default StatusHistory;
