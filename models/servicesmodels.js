const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({
  roomNo: {
    type: Number,
    required: true
  },
  requestedTime: {
    type: Date,
    default: Date.now
  },
  type:{
    type: String,
    enum: ['Laundry', 'Amenities', 'Maintenance'],
    required: true
  },
  comments:{
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['requested', 'pending', 'provided'],
    default: 'requested'
  }
}, { collection: 'Services' });

module.exports = mongoose.model('Services', servicesSchema);
