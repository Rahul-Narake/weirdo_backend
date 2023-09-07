const User = require('../../models/User');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const signup = async (req, res) => {
  try {
    const reqBody = await req.body;
    const { name, email, password, contactNumber, about, address } = reqBody;

    if (!name || !email || !password || !contactNumber || !about || !address) {
      return res
        .status(400)
        .json({ message: 'All feilds required!', success: false });
    }

    const user = await User.findOne({ email });

    if (user) {
      if (user.role.includes('USER')) {
        return res.status(200).json({
          message: 'User already exist with this email please try to login',
          success: true,
        });
      } else {
        user.role.push('USER');
        await user.save();
        return res.status(200).json({
          message:
            'Looks like you have registered you got user permissions please try to login',
          success: true,
        });
      }
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const role = ['USER'];

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      about,
      role,
      contactNumber,
      address,
    });
    await newUser.save();
    return res
      .status(201)
      .json({ message: 'User registered successfully', success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

const login = async (req, res) => {
  try {
    const reqBody = await req.body;
    const { email, password } = reqBody;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Invalid credentials', success: false });
    }
    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) {
      return res
        .status(400)
        .json({ message: 'Invalid credentials', success: false });
    }

    if (!user.role.includes('USER')) {
      return res
        .status(403)
        .json({ message: 'Unauthenticated', success: false });
    }
    const data = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    const token = await jsonwebtoken.sign(data, JWT_SECRET);
    return res
      .status(200)
      .json({ message: 'LoggedIn successfull', success: true, token });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    return res
      .status(200)
      .json({ message: 'User found successfully', success: true, user });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

const updateUser = async (req, res) => {
  try {
    const reqBody = await req.body;
    const file = req.file;
    const { name, email, contactNumber, about, state, city, pincode } = reqBody;

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

    const address = { state, city, pincode };
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { name, email, about, contactNumber, image: file.path, address }
    );
    return res
      .status(200)
      .json({ message: 'User data updated successfully', success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

module.exports = { signup, login, getCurrentUser, updateUser };
