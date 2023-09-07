const Category = require('../../models/Category');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.status(200).json({
      message: 'Categories loaded successfully',
      success: true,
      categories,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

module.exports = { getCategories };
