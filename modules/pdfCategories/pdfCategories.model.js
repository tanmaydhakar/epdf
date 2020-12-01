const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PdfCategory extends Model {
    static associate(models) {}
  }
  PdfCategory.init(
    {
      pdf_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'pdfs',
          key: 'id'
        }
      },
      category_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'categories',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: 'PdfCategory',
      tableName: 'pdf_categories'
    }
  );

  return PdfCategory;
};
