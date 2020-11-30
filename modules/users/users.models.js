const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

let allModels;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.UserRole, { as: 'userRole', foreignKey: 'user_id' });
      this.hasMany(models.UserProfile, { as: 'userProfile', foreignKey: 'user_id' });
    }
  }
  User.init(
    {
      username: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
      },
      email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
      },
      password: {
        allowNull: false,
        type: DataTypes.TEXT
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  User.beforeCreate(function (model, options) {
    return new Promise(resolve => {
      const encryptedPassword = bcrypt.hashSync(model.password, 10);
      model.password = encryptedPassword;
      return resolve(null, options);
    });
  });

  User.registerModels = function (models) {
    allModels = models;
  };

  User.afterCreate(async user => {
    const { Role, UserRole, UserProfile } = allModels;

    const field = {
      name: 'reader'
    };
    const role = await Role.findBySpecificField(field);

    const userRole = new UserRole();
    userRole.user_id = user.id;
    userRole.role_id = role.id;
    await userRole.save();

    const userProfile = new UserProfile();
    userProfile.user_id = user.id;
    await userProfile.save();
  });

  User.findBySpecificField = async function (fields) {
    const queryOptions = {
      where: fields
    };

    const user = await User.findOne(queryOptions);
    return user;
  };

  return User;
};
