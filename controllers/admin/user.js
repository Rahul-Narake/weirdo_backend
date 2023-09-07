const User = require('../../models/User');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const signup = async (req, res) => {
  try {
    const reqBody = await req.body;
    const { name, email, password, about, contactNumber, address } =
      await reqBody;

    const user = await User.findOne({ email });
    if (user) {
      if (!user.role.includes('ADMIN')) {
        user.role.push('ADMIN');
      }
      return res.status(400).json({
        message: 'User alerady exist',
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const roles = ['ADMIN'];
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      about,
      contactNumber,
      role: roles,
      address,
    });
    await newUser.save();
    return res.status(201).json({
      message: 'User registered successfully',
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const reqBody = await req.body;
    const { email, password } = reqBody;

    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(400).json({
        message: 'User not exist with this email',
        success: false,
      });
    }

    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({
        message: 'Invalid Credentials',
        success: false,
      });
    }

    const data = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    const token = await jsonwebtoken.sign(data, JWT_SECRET);
    res.cookie('token', token, {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: true,
      domain: 'localhost',
    });
    return res
      .status(200)
      .json({ message: 'login successfull', success: true, token: token });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        message: 'User not exists',
        success: false,
      });
    }
    return res.status(200).json({
      message: 'User found successfully',
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const file = await req.file;
    const { name, email, about, contactNumber, state, city, pincode } =
      await req.body;

    if (
      !file ||
      !name ||
      !email ||
      !about ||
      !contactNumber ||
      !state ||
      !city ||
      !pincode
    ) {
      return res
        .status(400)
        .json({ message: 'All Feilds required', success: false });
    }

    const user = req.user;

    await User.findByIdAndUpdate(
      { _id: user._id },
      {
        name,
        email,
        contactNumber,
        about,
        address: { state, city, pincode },
        image: file.path,
      }
    );

    return res
      .status(200)
      .json({ message: 'profile update successfully', success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

module.exports = { signup, login, getCurrentUser, updateUser };
