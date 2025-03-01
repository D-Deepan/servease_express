const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    roomNo: { type:Number, required: true},
    quantity: { type: Number, required: true },
    status: { type: String, enum: ['queued', 'preparing', 'served'], default: 'queued' }, // Order status
    orderedAt: { type: Date, default: Date.now }
  }, { collection: 'Orders' });
  
  module.exports = mongoose.model('Orders', orderSchema);
  