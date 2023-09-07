const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name required'],
  },
  description: {
    type: String,
    required: [true, 'product description status'],
  },
  active: {
    type: Boolean,
    default: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    required: [true, 'category required'],
  },
  image: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    required: [true, 'category required'],
  },
  colors: [{ type: String, required: true }],
  sizes: [{ type: String, required: true }],
});

const Product =
  mongoose.models.products || mongoose.model('products', productSchema);
module.exports = Product;
