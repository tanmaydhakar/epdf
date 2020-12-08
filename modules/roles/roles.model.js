const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      this.belongsTo(models.UserRole, { as: 'userRole', sourceKey: 'role_id', foreignKey: 'id' });
    }
  }
  Role.init(
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
      modelName: 'Role',
      tableName: 'roles'
    }
  );

  Role.findBySpecificField = async function (fields) {
    const queryOptions = {
      where: fields
    };

    const role = await Role.findOne(queryOptions);
    return role;
  };

  Role.getRoles = async function (data) {
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

    const roles = await Role.findAndCountAll({
      where: whereStatement,
      order: sortBy,
      offset,
      limit,
      attributes: ['id', 'name'],
      raw: true
    });

    return roles;
  };

  return Role;
};
