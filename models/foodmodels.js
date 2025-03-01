const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  availability: { type: Boolean, default: true }, // indicates if the food is currently available
}, { collection: 'Food' });

module.exports = mongoose.model('Food', foodSchema);
