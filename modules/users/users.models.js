const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

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
      tableName: 'users'
    }
  );

  User.beforeCreate(function (model, options) {
    return new Promise(resolve => {
      const encryptedPassword = bcrypt.hashSync(model.password, 10);
      model.password = encryptedPassword;
      return resolve(null, options);
    });
  });

  return User;
};
