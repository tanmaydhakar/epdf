const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PdfPreviews extends Model {}
  PdfPreviews.init(
    {
      image_url: {
        type: DataTypes.STRING
      },
      pdf_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'pdfs',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: 'PdfPreviews',
      tableName: 'pdf_previews'
    }
  );

  return PdfPreviews;
};
