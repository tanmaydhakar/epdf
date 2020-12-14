const path = require('path');

const serializer = require(path.resolve('./modules/categories/categories.serializer'));
const db = require(path.resolve('./models'));
const { Category } = db;

const index = async function (req, res) {
  const categories = await Category.getCategories(req);

  const responseData = await serializer.categories(categories);
  return res.status(200).json({ categories: responseData, total: categories.count });
};

const add = async function (req, res) {
  const category = await Category.addCategory(req);

  const responseData = await serializer.category(category);
  return res.status(200).json({ categories: responseData });
};

const update = async function (req, res) {
  const category = await Category.updateCategory(req);

  const responseData = await serializer.category(category);
  return res.status(200).json({ categories: responseData });
};

const destroy = async function (req, res) {
  await Category.destroyCategory(req);

  return res.status(200).json({ status: 'category has been deleted successfully' });
};

const count = async function (req, res) {
  const categoriesCount = await Category.getCount();

  return res.status(200).json({ count: categoriesCount });
};

module.exports = {
  index,
  add,
  update,
  destroy,
  count
};
