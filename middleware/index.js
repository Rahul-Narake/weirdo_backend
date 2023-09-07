const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

const fetchAdminUser = async (req, res, next) => {
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

    if (!user.role.includes('ADMIN')) {
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

module.exports = fetchAdminUser;
