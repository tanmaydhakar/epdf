const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {}
  UserProfile.init(
    {
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
        type: DataTypes.STRING,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: 'UserProfile',
      tableName: 'user_profiles',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  return UserProfile;
};
