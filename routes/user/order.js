const express = require('express');
const fetchUser = require('../../middleware/normaluser');
const {
  createOrder,
  completeOrder,
  getOrders,
} = require('../../controllers/user/order');
const router = express.Router();

router.post('/create', fetchUser, createOrder);
router.post('/complete', fetchUser, completeOrder);
router.get('/', fetchUser, getOrders);

module.exports = router;
