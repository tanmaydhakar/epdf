const { Model, Op } = require('sequelize');

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
    const { name, sort } = data.query;
    let { page } = data.query;

    page = page && !isNaN(page) && parseInt(page) > 0 ? parseInt(page) - 1 : 0;
    const limit = 10;
    const offset = page * limit;
    const whereStatement = {};
    const sortBy = [];

    if (sort && sort === 'name') {
      sortBy.push(['name', 'asc']);
    } else {
      sortBy.push(['updatedAt', 'desc']);
    }

    if (name) {
      whereStatement.name = {
        [Op.like]: `${name}%`
      };
    }

    const categories = await Category.findAndCountAll({
      where: whereStatement,
      order: sortBy,
      offset,
      limit,
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

  Category.getCount = async function () {
    const categoriesCount = await Category.count();

    return categoriesCount;
  };

  return Category;
};
