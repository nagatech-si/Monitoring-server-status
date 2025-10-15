import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Group = mongoose.model('Group', groupSchema, 'tm_group');

export default Group;