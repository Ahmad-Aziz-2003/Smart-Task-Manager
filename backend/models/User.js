const mongoose = require('mongoose');
const categorySchema = require('./Category');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  categories: [categorySchema],
});

module.exports = mongoose.model('User', userSchema); 