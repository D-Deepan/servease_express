const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNo: {
    type: Number,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['single', 'double', 'suite'],
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Ensures price is non-negative
  },
  isBooked: {
    type: Boolean,
    default: false, // Indicates if the room is available by default
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // Reference to the Users collection
    default: null, // No customer assigned initially
  },
  bookingDate: {
    type: Date,
    default: null, // No booking date initially
  },
  checkoutDate: {
    type: Date,
    default: null, // No checkout date initially
  },
}, {collection: 'Rooms'});

module.exports = mongoose.model('Rooms', roomSchema);
