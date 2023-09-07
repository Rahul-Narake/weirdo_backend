const express = require('express');
const connectToMONGO = require('./db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
connectToMONGO();

const app = express();
const port = 5001;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

//available routes for admin
app.use('/api/users', require('./routes/admin/user'));
app.use('/api/category', require('./routes/admin/category'));
app.use('/api/product', require('./routes/admin/product'));
app.use('/forgot-password', require('./routes/index'));
app.use('/change-password', require('./routes/index'));

//available route for user
app.use('/users', require('./routes/user/user'));
app.use('/category', require('./routes/user/category'));
app.use('/product', require('./routes/user/product'));
app.use('/cart', require('./routes/user/cart'));
app.use('/order', require('./routes/user/order'));

app.listen(port, () => {
  console.log('Server strted on port :' + port);
});
