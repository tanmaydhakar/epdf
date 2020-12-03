const { Model } = require('sequelize');

let allModels;

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {
      this.hasOne(models.User, { as: 'user', sourceKey: 'user_id', foreignKey: 'id' });
    }
  }
  UserProfile.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      first_name: {
        type: DataTypes.STRING
      },
      last_name: {
        type: DataTypes.STRING
      },
      full_name: {
        type: DataTypes.STRING
      },
      phone: {
        type: DataTypes.STRING
      },
      city: {
        type: DataTypes.STRING
      },
      state: {
        type: DataTypes.STRING
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: 'UserProfile',
      tableName: 'user_profiles'
    }
  );

  UserProfile.registerModels = function (models) {
    allModels = models;
  };

  UserProfile.findBySpecificField = async function (fields) {
    const queryOptions = {
      where: fields
    };

    const userProfile = await UserProfile.findOne(queryOptions);
    return userProfile;
  };

  UserProfile.updateUserProfile = async function (data) {
    const userId = data.body.user_id;

    const field = {
      user_id: userId
    };
    let userProfile = await UserProfile.findBySpecificField(field);

    userProfile.first_name = data.body.first_name;
    userProfile.last_name = data.body.last_name;
    userProfile.full_name = `${data.body.first_name} ${data.body.last_name}`;
    userProfile.phone = data.body.phone;
    userProfile.city = data.body.city;
    userProfile.state = data.body.state;
    await userProfile.save();

    userProfile = await UserProfile.getUserProfile(userId);
    return userProfile;
  };

  UserProfile.getUserProfile = async function (userId) {
    const userProfile = await UserProfile.findOne({
      where: {
        user_id: userId
      },
      attributes: ['id', 'first_name', 'last_name', 'full_name', 'phone', 'city', 'state'],
      include: [{ model: allModels.User, as: 'user', attributes: ['id', 'username', 'email'] }]
    });

    return userProfile;
  };

  return UserProfile;
};
