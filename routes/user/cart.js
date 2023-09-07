const express = require('express');
const fetchUser = require('../../middleware/normaluser');
const {
  addToCart,
  getCartItems,
  removeFromCart,
} = require('../../controllers/user/cart');
const router = express.Router();

router.post('/', fetchUser, addToCart);

router.get('/', fetchUser, getCartItems);

router.delete('/:productId', fetchUser, removeFromCart);

module.exports = router;
