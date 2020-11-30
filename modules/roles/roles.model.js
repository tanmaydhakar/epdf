const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      this.belongsTo(models.UserRole, { as: 'userRole', foreignKey: 'role_id' });
    }
  }
  Role.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'roles',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  Role.findBySpecificField = async function (fields) {
    const queryOptions = {
      where: fields
    };

    const role = await Role.findOne(queryOptions);
    return role;
  };

  return Role;
};
