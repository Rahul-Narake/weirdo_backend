const Product = require('../../models/Product');
const Category = require('../../models/Category');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({
      message: 'Products loaded successfully',
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const category = await Category.findById({ _id: categoryId });
    if (!category) {
      return res
        .status(400)
        .json({ message: 'Category not exist', success: false });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.find({ category: categoryId });
    const products = await Product.find({ category: categoryId })
      .skip(skip)
      .limit(limit);
    const lastPage = totalProducts.length / limit;
    const last = page === lastPage ? true : false;

    return res.status(200).json({
      message: 'Products loaded successfully',
      success: true,
      products,
      last,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

const getProductByFilter = async (req, res) => {
  try {
    const reqBody = await req.body;
    const { category, colors, sizes, prices } = await reqBody;
    const cat = await Category.findById({ _id: category });
    if (!cat) {
      return res
        .status(400)
        .json({ message: 'Category not exist', success: false });
    }
    const products = await Product.find({ category });
    let filteredProducts = [];
    if (products.length > 0) {
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        secondLoop: for (let j = 0; j < sizes.length; j++) {
          const size = sizes[j];
          if (product.sizes.includes(size)) {
            for (let k = 0; k < colors.length; k++) {
              if (product.colors.includes(colors[k])) {
                for (let l = 0; l < prices.length; l++) {
                  const price = prices[l];
                  if (product.price <= price) {
                    filteredProducts.push(product);
                    break;
                  } else {
                    break secondLoop;
                  }
                }
              }
            }
          }
        }
      }

      return res.json({
        message: 'Products found after filter',
        success: true,
        products: filteredProducts,
      });
    } else {
      return res.status(200).json({
        message: 'Products not available in this category',
        success: false,
      });
    }
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
      .json({ message: 'Product founs successfully', success: true, product });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

const getSearchedProducts = async (req, res) => {
  try {
    const text = req.params.text;
    if (text) {
      const products = await Product.find({});
      let searchedProducts = [];
      products.forEach((product) => {
        if (product.name.includes(text) || product.description.includes(text)) {
          searchedProducts.push(product);
        }
      });
      return res.status(200).json({
        message: 'Products filtered after search are here',
        success: true,
        searchedProducts,
      });
    } else {
      return res.status(400).json({ message: 'Envalid text', success: false });
    }
  } catch (error) {
    return res.status(200).json({ error: error.message, success: false });
  }
};

module.exports = {
  getProducts,
  getProductsByCategory,
  getProductByFilter,
  getProductById,
  getSearchedProducts,
};
