const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#3B82F6', // Default blue color
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = categorySchema; 