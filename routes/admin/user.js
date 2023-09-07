const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  getCurrentUser,
  updateUser,
} = require('../../controllers/admin/user');
const fetchAdminUser = require('../../middleware');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './uploads/profile');
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post('/signup', signup);

router.post('/login', login);

router.get('/current', fetchAdminUser, getCurrentUser);

router.put('/', fetchAdminUser, upload.single('image'), updateUser);

module.exports = router;
