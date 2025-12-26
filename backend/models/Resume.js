const { Schema } = require('mongoose');
const { mongoose } = require('../db');

const ResumeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  filename: String,
  uploadedAt: { type: Date, default: Date.now },
  text: String,
  metadata: Schema.Types.Mixed
});

module.exports = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
