const Cart = require('../../models/Cart');

const addToCart = async (req, res) => {
  try {
    const reqBody = await req.body;
    const { productName, productId, price, quantity, image, size } = reqBody;

    if (!productName || !productId || !price || !quantity || !image || !size) {
      return res
        .status(400)
        .json({ message: 'All feilds required', success: false });
    }

    const item = await Cart.findOne({ user: req.user._id, productId });
    if (item) {
      return res
        .status(200)
        .json({ message: 'Product already added to cart', success: false });
    }

    const cart = new Cart({
      productName,
      productId,
      price,
      quantity,
      user: req.user.id,
      image,
      size,
    });

    await cart.save();
    const cartItems = await Cart.find({ user: req.user._id });

    return res.status(200).json({
      message: 'Product added to cart successfully',
      success: true,
      cartItems,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

const getCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.find({ user: req.user.id });
    return res.status(200).json({
      message: 'Cart Items loaded successfully',
      success: true,
      cartItems,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    await Cart.findOneAndDelete({ user: req.user._id, productId });
    const cartItems = await Cart.find({ user: req.user._id });
    return res.status(200).json({
      message: 'Product removed from cart successfully',
      success: true,
      cartItems,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, success: false, productId });
  }
};

module.exports = { addToCart, getCartItems, removeFromCart };
