const { Model } = require('sequelize');

let allModels;

module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate(models) {
      this.hasOne(models.Role, { as: 'role', sourceKey: 'role_id', foreignKey: 'id' });
    }
  }
  UserRole.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
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
      tableName: 'user_roles'
    }
  );

  UserRole.registerModels = function (models) {
    allModels = models;
  };

  UserRole.addUserRole = async function (data) {
    const { userId, roleId } = data.params;

    const user = await allModels.User.findByPk(userId);
    const role = await allModels.Role.findByPk(roleId);

    const userRole = new UserRole();
    userRole.user_id = user.id;
    userRole.role_id = role.id;
    userRole.save();

    const userRoleData = {
      id: userRole.id,
      user,
      role
    };
    return userRoleData;
  };

  UserRole.destroyUserRole = async function (data) {
    const { userId, roleId } = data.params;

    await UserRole.destroy({
      where: {
        user_id: userId,
        role_id: roleId
      }
    });
  };

  return UserRole;
};
