const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  hesitation: {
    type: String,
    default: ''
  },
  completion: {
    type: String,
    enum: ['yes_easily', 'yes_struggled', 'no_gave_up', ''],
    default: ''
  },
  resultSense: {
    type: String,
    default: ''
  },
  mostUseful: {
    type: String,
    default: ''
  },
  reuse: {
    type: String,
    default: ''
  },
  pay: {
    type: String,
    default: ''
  },
  sus1: { type: String, default: null },
  sus2: { type: String, default: null },
  sus3: { type: String, default: null },
  sus4: { type: String, default: null },
  sus5: { type: String, default: null },
  testMode: {
    type: String,
    enum: ['standard', 'adaptive', 'unknown'],
    default: 'unknown'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
