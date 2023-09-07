const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'category title required'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'category description required'],
  },
  imageUrl: {
    type: String,
  },
});

const Category =
  mongoose.models.categories || mongoose.model('categories', categorySchema);
module.exports = Category;
