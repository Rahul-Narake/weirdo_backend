const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  orderId: {
    type: String,
  },
  paymentId: {
    type: String,
  },
  receipt: String,
  amount: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  products: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
      },
      name: String,
      quantity: Number,
    },
  ],
  currency: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
});

const Order = mongoose.models.orders || mongoose.model('orders', orderSchema);
module.exports = Order;
