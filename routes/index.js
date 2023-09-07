const express = require('express');
const router = express.Router();
const jsonwebtoken = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;
const sendEmail = require('../helper/index');

const fetchUser = async (req, res, next) => {
  try {
    const authHeader = await req.header('Authorization');

    if (!authHeader) {
      return res.status(403).json({
        message: 'Unauthenticated',
        success: false,
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(403).json({
        message: 'Unauthenticated ',
        success: false,
      });
    }
    const data = await jsonwebtoken.verify(token, JWT_SECRET);
    if (!data) {
      return res.status(403).json({
        message: 'Unauthenticated ',
        success: false,
      });
    }
    const user = await User.findById({
      _id: data.user.id,
    });

    if (!user) {
      return res.status(403).json({
        message: 'Unauthenticated ',
        success: false,
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: 'Email is required', success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'User not exists', success: false });
    }
    await sendEmail(email, 'forgot-password', 'FORGOT PASSWORD', user._id);
    return res.status(200).json({
      message: 'Mail sent successfully',
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
});

router.post('/change', async (req, res) => {
  try {
    const reqBody = await req.body;
    const { password, token } = reqBody;
    if (!password || !token) {
      return res.status(500).json({ message: 'Invalid Data', success: false });
    }
    const user = await User.findOne({ forgotPasswordToken: token });
    if (!user) {
      return res
        .status(403)
        .json({ message: 'Unauthenticated enter valid token', success: false });
    }

    if (Date.now() > user.forgotPasswordTokenExpiry) {
      return res
        .status(400)
        .json({ message: 'Token expired generate again', success: false });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;

    await user.save();

    return res
      .status(200)
      .json({ message: 'Password changed successfully', success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
});

module.exports = router;
