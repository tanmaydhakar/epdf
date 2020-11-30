const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate(models) {
      this.hasOne(models.Role, { as: 'role', sourceKey: 'role_id', foreignKey: 'id' });
    }
  }
  UserRole.init(
    {
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      role_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'roles',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: 'UserRole',
      tableName: 'user_roles',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  return UserRole;
};
