const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  ingredients: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);