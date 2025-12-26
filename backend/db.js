const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || null;

async function connectDb() {
  if (!MONGO_URI) {
    console.warn('MONGO_URI not set. Skipping MongoDB connection.');
    return;
  }
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'smartapply' });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
  }
}

module.exports = { connectDb, mongoose };
