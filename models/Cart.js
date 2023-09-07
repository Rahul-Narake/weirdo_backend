const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  productName: { type: String, required: [true, 'Product name required'] },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  image: { type: String },
  size: { type: String, required: true, enum: ['S', 'L', 'M', 'XL', 'XXL'] },
});

const Cart = mongoose.models.carts || mongoose.model('carts', cartSchema);
module.exports = Cart;
