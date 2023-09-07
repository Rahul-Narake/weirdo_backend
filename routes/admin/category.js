const express = require('express');
const router = express.Router();
const {
  addCategory,
  getCategories,
} = require('../../controllers/admin/category');
const fetchAdminUser = require('../../middleware/index');

router.post('/', fetchAdminUser, addCategory);
router.get('/', fetchAdminUser, getCategories);

module.exports = router;
