const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pdf extends Model {}
  Pdf.init(
    {
      title: {
        allowNull: false,
        type: DataTypes.STRING
      },
      pdf_url: {
        allowNull: false,
        type: DataTypes.STRING
      },
      author: {
        allowNull: false,
        type: DataTypes.STRING
      },
      short_description: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      access_type: {
        allowNull: false,
        type: DataTypes.ENUM('Public', 'Private'),
        defaultValue: 'Public'
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
      modelName: 'Pdf',
      tableName: 'pdfs'
    }
  );

  return Pdf;
};
