const express = require('express');
const {
  addProduct,
  getProductsByCategory,
  changeStatus,
  removeProduct,
  updateProduct,
  getProductById,
} = require('../../controllers/admin/product');
const fetchAdminUser = require('../../middleware');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './uploads/product');
  },
  filename: function (req, file, cb) {
    return cb(null, `${req.user._id}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post('/', fetchAdminUser, upload.single('image'), addProduct);

router.get('/category/:categoryId', fetchAdminUser, getProductsByCategory);

router.get('/:productId', fetchAdminUser, changeStatus);

router.get('/get/:productId', fetchAdminUser, getProductById);

router.delete('/:productId', fetchAdminUser, removeProduct);

router.put(
  '/:productId',
  fetchAdminUser,
  upload.single('image'),
  updateProduct
);

module.exports = router;
