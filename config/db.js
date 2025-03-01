const mongoose = require('mongoose');
//const uri = "mongodb+srv://servease:servease@servease.4nimu.mongodb.net/servease?retryWrites=true&w=majority&appName=servease";
const uri = "mongodb+srv://deepan:servease@servease.gu3um.mongodb.net/?retryWrites=true&w=majority&appName=Servease";
const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
