const User = require('../../models/User');
const Category = require('../../models/Category');
const Product = require('../../models/Product');

const addProduct = async (req, res) => {
  try {
    const reqBody = await req.body;
    const { name, description, category, price, colors, sizes } = reqBody;
    const file = req.file;
    if (
      !file ||
      !name ||
      !category ||
      !description ||
      !price ||
      !colors ||
      !sizes
    ) {
      return res.status(400).json({
        message: 'All feilds required',
        success: false,
      });
    }

    const cat = await Category.findById({ _id: category });
    if (!cat) {
      return res
        .status(400)
        .json({ message: 'Category not found', success: false });
    }
    const clrs = colors.split(',');
    const sz = sizes.split(',');

    const product = new Product({
      name,
      description,
      price,
      category,
      user: req.user._id,
      colors: clrs,
      sizes: sz,
      image: file.path,
    });

    await product.save();
    return res
      .status(200)
      .json({ message: 'Product Added successfully', success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const reqBody = await req.body;
    const { name, description, category, price, colors, sizes } = reqBody;
    const file = req.file;
    if (!file || !name || !description || !price || !colors || !sizes) {
      return res.status(400).json({
        message: 'All feilds required',
        success: false,
      });
    }

    const cat = await Category.findById({ _id: category });
    if (!cat) {
      return res
        .status(400)
        .json({ message: 'Category not found', success: false });
    }
    const clrs = colors.split(',');
    const sz = sizes.split(',');

    await Product.findByIdAndUpdate(
      { _id: productId },
      {
        name,
        description,
        price,
        category,
        colors: clrs,
        sizes: sz,
        image: file.path,
      }
    );

    return res
      .status(200)
      .json({ message: 'Product Updated successfully', success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.categoryId;
    const cat = await Category.findById({ _id: category });
    if (!cat) {
      return res
        .status(400)
        .json({ message: 'Category not found', success: false });
    }

    const products = await Product.find({ category, user: req.user._id });
    return res.status(200).json({
      message: 'Products loaded successfully',
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

const changeStatus = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById({ _id: productId });
    if (!product) {
      return res
        .status(400)
        .json({ message: 'Product not exists', success: false });
    }
    const status = product.active === true ? false : true;
    await Product.findByIdAndUpdate({ _id: productId }, { active: status });
    return res.status(200).json({
      message: 'Status updated successfully',
      success: true,
      _id: productId,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

const getProductById = async (req, res) => {
  try {
    const _id = req.params.productId;
    const product = await Product.findById({ _id });
    if (!product) {
      return res
        .status(400)
        .json({ message: 'Product not found', success: false });
    }
    return res
      .status(200)
      .json({ message: 'Product found successfully', success: true, product });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

const removeProduct = async (req, res) => {
  try {
    const _id = req.params.productId;
    Product.findByIdAndDelete({ _id });
    return res
      .status(200)
      .json({ message: 'Product Deleted successfully', success: true, _id });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

module.exports = {
  addProduct,
  updateProduct,
  getProductsByCategory,
  changeStatus,
  getProductById,
  removeProduct,
};
