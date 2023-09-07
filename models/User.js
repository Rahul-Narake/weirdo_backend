const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name required'],
  },
  email: {
    type: String,
    required: [true, 'email required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'password required'],
  },
  about: {
    type: String,
    required: [true, 'Enter something about you'],
  },
  contactNumber: {
    type: String,
    required: true,
  },
  role: [{ type: String, enum: ['ADMIN', 'USER'], required: true }],
  address: {
    city: { type: String },
    pincode: { type: String },
    state: { type: String },
  },
  image: {
    type: String,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
});

const User = mongoose.models.users || mongoose.model('users', userSchema);
module.exports = User;
