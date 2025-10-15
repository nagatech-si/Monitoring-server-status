import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  cause: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['resolved', 'ongoing'],
    required: true
  },
  timelines: [
    {
      status: {
        type: String,
        enum: ['Resolved', 'Investigating', 'Monitoring', 'Open'],
        required: true
      },
      time: {
        type: Date,
        required: true
      },
      message: {
        type: String,
        required: true
      }
    }
  ]
}, {
  timestamps: true
});

const Incident = mongoose.model('Incident', incidentSchema, 'tt_incident');
export default Incident;
