const Category = require('../../models/Category');

const addCategory = async (req, res) => {
  try {
    const reqBody = await req.body;
    const { title, description, imageUrl } = reqBody;
    const category = new Category({
      title,
      description,
      imageUrl,
    });
    await category.save();
    return res.status(201).json({
      message: 'Category added successfully',
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.status(200).json({
      message: 'categories loaded successfull',
      success: true,
      categories: categories,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

module.exports = { addCategory, getCategories };
