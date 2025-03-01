const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\S+@\S+\.\S+$/, // Email validation regex
      'Please provide a valid email address',
    ],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['customer', 'manager', 'admin'],
    default: 'customer',
  },
  roomNo: {
    type: Number,
    default: null, // Indicates no room assigned yet
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  refreshToken: {
    type: String
  }
}, { collection: 'Users' });

module.exports = mongoose.model('Users', userSchema);
