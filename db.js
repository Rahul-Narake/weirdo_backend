const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://127.0.0.1:27017/e-commerse';
const connectToMONGO = async () => {
  await mongoose.connect(MONGO_URL);
  console.log('connection successfull');
};

module.exports = connectToMONGO;
