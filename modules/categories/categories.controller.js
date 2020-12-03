const path = require('path');

const errorHandler = require(path.resolve('./utilities/errorHandler'));
const serializer = require(path.resolve('./modules/categories/categories.serializer'));
const db = require(path.resolve('./models'));
const { Category } = db;

const index = async function (req, res) {
  try {
    const categories = await Category.getCategories();

    const responseData = await serializer.categories(categories);
    return res.status(200).json({ categories: responseData });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

const add = async function (req, res) {
  try {
    const category = await Category.addCategory(req);

    const responseData = await serializer.category(category);
    return res.status(200).json({ categories: responseData });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

const update = async function (req, res) {
  try {
    const category = await Category.updateCategory(req);

    const responseData = await serializer.category(category);
    return res.status(200).json({ categories: responseData });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

const destroy = async function (req, res) {
  try {
    await Category.destroyCategory(req);

    return res.status(200).json({ status: 'category has been deleted successfully' });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

module.exports = {
  index,
  add,
  update,
  destroy
};
