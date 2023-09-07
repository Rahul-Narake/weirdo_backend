const express = require('express');
const fetchUser = require('../../middleware/normaluser');
const { getCategories } = require('../../controllers/user/category');
const router = express.Router();

router.get('/', fetchUser, getCategories);

module.exports = router;
