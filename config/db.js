const mongoose = require('mongoose');
//const uri ="mongodb://localhost:27017/hotel";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
