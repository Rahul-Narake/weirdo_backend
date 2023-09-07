const express = require('express');
const {
  signup,
  login,
  getCurrentUser,
  updateUser,
} = require('../../controllers/user/user');
const fetchUser = require('../../middleware/normaluser');
const router = express.Router();
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
router.get('/', fetchUser, getCurrentUser);
router.put('/', fetchUser, upload.single('image'), updateUser);

module.exports = router;
