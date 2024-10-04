const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  trainer: {
    type: Object,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: [String], // Array of strings for times
    required: true
  },
  category: {
    type: String,
    required: true
  },
  trainee: {
    type: [String], // Array of trainee IDs or names
    default: []
  }
});


module.exports = mongoose.model('Class', ClassSchema);