const express = require('express');
const router = express.Router();
const fetchUser = require('../../middleware/normaluser');
const {
  getProducts,
  getProductsByCategory,
  getProductByFilter,
  getProductById,
  getByQuery,
  getSearchedProducts,
} = require('../../controllers/user/product');

router.get('/', fetchUser, getProducts);

router.get('/:categoryId', fetchUser, getProductsByCategory);

router.post('/filter', fetchUser, getProductByFilter);

router.get('/get/:productId', fetchUser, getProductById);

router.get('/search/:text', fetchUser, getSearchedProducts);

module.exports = router;
