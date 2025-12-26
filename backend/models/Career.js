const { Schema } = require('mongoose');
const { mongoose } = require('../db');

// Career/Job Schema - for dynamic career management by admins
const CareerSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  domain: { type: String, required: true }, // e.g., "Technology", "Healthcare"
  subdomain: { type: String, required: true }, // e.g., "Software Development"
  description: { type: String, required: true },
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  growth: String, // e.g., "High", "15% annually"
  skills: [String],
  experienceLevels: [String], // e.g., ["Entry", "Mid", "Senior"]
  education: [String], // Required education
  responsibilities: [String],
  certifications: [String],
  isActive: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp on save
CareerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Career = mongoose.model('Career', CareerSchema);

module.exports = Career;

