const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {}
  }
  Category.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories'
    }
  );

  Category.findBySpecificField = async function (fields) {
    const queryOptions = {
      where: fields
    };

    const category = await Category.findOne(queryOptions);
    return category;
  };

  Category.getCategories = async function (data) {
    const wherestatement = {};
    const sortBy = [];

    if (data.query.sort === 'name') {
      sortBy.push(['name', 'asc']);
    } else {
      sortBy.push(['updatedAt', 'desc']);
    }
    const categories = await Category.findAll({
      where: wherestatement,
      order: sortBy,
      attributes: ['id', 'name'],
      raw: true
    });

    return categories;
  };

  Category.addCategory = async function (data) {
    const { name } = data.body;

    const category = new Category();
    category.name = name;
    await category.save();

    return category;
  };

  Category.updateCategory = async function (data) {
    const { categoryId } = data.params;
    const { name } = data.body;

    const category = await Category.findByPk(categoryId);
    category.name = name;
    await category.save();

    return category;
  };

  Category.destroyCategory = async function (data) {
    const { categoryId } = data.params;

    const category = await Category.findByPk(categoryId);
    await category.destroy();

    return category;
  };

  return Category;
};
