import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  }, 
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  }, 
  allDay: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;