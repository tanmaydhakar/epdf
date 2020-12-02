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

  PdfPreviews.createPdfPreview = async function (data) {
    const { pdfId, previews } = data.body;

    for (let i = 0; i < previews.length; i += 1) {
      const pdfPreviews = new PdfPreviews();

      pdfPreviews.image_url = previews[i];
      pdfPreviews.pdf_id = pdfId;
      await pdfPreviews.save();
    }
    const previewsData = this.getPreviews(pdfId);
    return previewsData;
  };

  PdfPreviews.updatePdfPreview = async function (data) {
    const { pdfId, previews } = data.body;

    let previewsData = await this.getPreviews(pdfId);
    const oldPreviews = previewsData.filter(
      previewObject => !previews.includes(previewObject.image_url)
    );

    for (let i = 0; i < oldPreviews.length; i += 1) {
      await oldPreviews[i].destroy();
    }

    for (let i = 0; i < previews.length; i += 1) {
      await PdfPreviews.findOrCreate({
        where: {
          image_url: previews[i],
          pdf_id: pdfId
        },
        defaults: {
          image_url: previews[i],
          pdf_id: pdfId
        }
      });
    }

    previewsData = await this.getPreviews(pdfId);
    return previewsData;
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
