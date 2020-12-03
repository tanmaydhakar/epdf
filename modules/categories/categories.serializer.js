const categories = async function (categories) {
  const finalCategories = [];

  for (let i = 0; i < categories.rows.length; i += 1) {
    const category = categories.rows[i];
    const categoryData = {};

    categoryData.id = category.id;
    categoryData.name = category.name;

    finalCategories.push(categoryData);
  }

  return finalCategories;
};

const category = async function (category) {
  const finalCategory = {};

  finalCategory.id = category.id;
  finalCategory.name = category.name;

  return finalCategory;
};

module.exports = {
  categories,
  category
};
