const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

let allModels;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.UserRole, { as: 'userRoles', foreignKey: 'user_id' });
      this.hasOne(models.UserProfile, { as: 'userProfile', foreignKey: 'user_id' });
      this.hasMany(models.Pdf, { as: 'pdfs', foreignKey: 'user_id' });
      this.belongsToMany(models.Role, {
        as: 'roles',
        through: models.UserRole,
        localKey: 'id',
        foreignKey: 'user_id',
        otherKey: 'role_id'
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
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

  User.beforeDestroy(async user => {
    const pdfs = await user.getPdfs();
    if (pdfs.length) {
      for (let i = 0; i < pdfs.length; i += 1) {
        await pdfs[i].destroy();
      }
    }

    const userRoles = await user.getUserRoles();
    if (userRoles.length) {
      for (let i = 0; i < userRoles.length; i += 1) {
        await userRoles[i].destroy();
      }
    }

    const userProfile = await user.getUserProfile();
    await userProfile.destroy();
  });

  User.registerModels = function (models) {
    allModels = models;
  };

  User.afterCreate(async (user, options) => {
    const { Role, UserRole, UserProfile } = allModels;

    const field = {};
    field.name = options.role ? options.role : 'Reader';

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
