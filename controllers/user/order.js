const Razorpay = require('razorpay');
const Cart = require('../../models/Cart');
const Order = require('../../models/Order');

const createOrder = async (req, res) => {
  try {
    const reqBody = await req.body;
    const { products, currency, amount } = reqBody;
    if (!products || !currency || !amount) {
      return res.status(400).json({
        message: 'Amount ,Products and currency required to procceed',
        success: false,
      });
    }
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    //generaing new recipt
    const receipt = () => {
      const date = new Date();
      const time = date.getTime();
      return 'txn_' + time;
    };

    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency,
      receipt: receipt(),
    };

    //creating order
    const createdOrder = await instance.orders.create(options);

    if (!createdOrder) {
      return NextResponse.json(
        {
          message: 'something went wrong',
          succes: false,
        },
        { status: 500 }
      );
    }

    //saving to db
    //creating object of order for db save
    const order = new Order({
      orderId: createdOrder.id,
      orderStatus: createdOrder.status,
      receipt: createdOrder.receipt,
      user: req.user._id,
      products,
      currency,
      amount,
    });

    //save order to db
    await order.save();

    return res.status(201).json({
      orderId: createdOrder.id,
      orderStatus: createdOrder.status,
      success: true,
      message: 'order created successfully.',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

const completeOrder = async (req, res) => {
  try {
    const reqBody = await req.body;
    const { orderId, paymentId, orderStatus, date } = reqBody;
    if (!orderId || !paymentId || !orderStatus || !date) {
      return res.status(400).json({
        message: 'Please provide completed order details',
        success: false,
      });
    }
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(400).json({
        message: "Don't have any order with this order Id",
        success: false,
      });
    }
    order.paymentId = paymentId;
    order.orderStatus = orderStatus;
    order.date = date;
    await order.save();
    await Cart.deleteMany({ user: req.user._id });

    return res
      .status(200)
      .json({ message: 'Order completed successfully', success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    return res
      .status(200)
      .json({ message: 'Orders loaded successfully', success: true, orders });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

module.exports = { createOrder, completeOrder, getOrders };
