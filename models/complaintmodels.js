const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  roomNo: {
    type: Number,
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // Reference to the Users collection
    default: null, // No customer assigned initially
  },
  requestedTime: {
    type: Date,
    default: Date.now
  },
  subject: {
    type: String,
    required: true
  },
  checked: {
    type: Boolean,
    default: false
  },
  details:{
    type: String,
    required: true   
  }

}, { collection: 'Complaint' });

module.exports = mongoose.model('Complaint', complaintSchema);