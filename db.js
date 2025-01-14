const mongoose = require('mongoose');
require('dotenv').config()
const uri = process.env.MONGO_URI;

const connectDB = mongoose
  .connect(uri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));