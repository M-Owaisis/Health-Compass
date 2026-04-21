const mongoose = require('mongoose');

const assessmentHistorySchema = new mongoose.Schema({
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patientProfile: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String },
    occupation: { type: String },
    education: { type: String },
    medicalFlags: [String],
  },
  scores: {
    raw: {
      earned: Number,
      total: Number,
      percentage: Number,
    },
    mocaEquivalent: {
      raw: Number,
      adjusted: Number,
      adjustments: [String],
    },
    byDomain: {
      type: Map,
      of: {
        earned: Number,
        total: Number,
        percentage: Number,
      }
    }
  },
  prediction: {
    risk_label: String,
    probability: Number,
    risk_level: String,
    recommendation: String,
  },
  interpretation: {
    level: String,
    note: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AssessmentHistory', assessmentHistorySchema);
