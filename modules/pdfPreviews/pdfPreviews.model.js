const { Model } = require('sequelize');

let allModels;

module.exports = (sequelize, DataTypes) => {
  class PdfPreviews extends Model {
    static associate(models) {
      this.hasOne(models.Pdf, { as: 'pdf', sourceKey: 'pdf_id', foreignKey: 'id' });
    }
  }
  PdfPreviews.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
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

  PdfPreviews.registerModels = function (models) {
    allModels = models;
  };

  PdfPreviews.getPreviews = async function (pdfId) {
    const previews = await PdfPreviews.findAll({
      where: {
        pdf_id: pdfId
      },
      include: [
        {
          model: allModels.Pdf,
          as: 'pdf',
          attributes: [
            'id',
            'title',
            'pdf_url',
            'author',
            'short_description',
            'access_type',
            'user_id'
          ]
        }
      ]
    });

    return previews;
  };

  return PdfPreviews;
};
