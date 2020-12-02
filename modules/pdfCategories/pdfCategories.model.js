const { Model, Sequelize } = require('sequelize');

let allModels;

module.exports = (sequelize, DataTypes) => {
  class PdfCategory extends Model {
    static associate(models) {
      this.hasOne(models.Category, { as: 'category', sourceKey: 'category_id', foreignKey: 'id' });
      this.hasOne(models.Pdf, { as: 'pdf', sourceKey: 'pdf_id', foreignKey: 'id' });
    }
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

  PdfCategory.registerModels = function (models) {
    allModels = models;
  };

  PdfCategory.getCategoriesId = async function (categories) {
    const categoriesData = await allModels.Category.findAll({
      where: {
        name: {
          [Sequelize.Op.in]: categories
        }
      },
      attributes: ['id']
    });

    return categoriesData;
  };

  PdfCategory.createPdfCategories = async function (data) {
    const { categories, pdfId } = data.body;

    const categoriesData = await this.getCategoriesId(categories);

    for (let i = 0; i <= categoriesData.length - 1; i += 1) {
      const pdfCategory = new PdfCategory();
      pdfCategory.pdf_id = pdfId;
      pdfCategory.category_id = categoriesData[i].id;

      await pdfCategory.save();
    }

    const pdfCategoriesData = await this.getPdfCategories(pdfId);
    return pdfCategoriesData;
  };

  PdfCategory.updatePdfCategories = async function (data) {
    const { categories, pdfId } = data.body;

    const pdf = await allModels.Pdf.findByPk(pdfId);
    const categoriesData = await this.getCategoriesId(categories);

    await pdf.setCategories(categoriesData);

    const pdfCategoriesData = await this.getPdfCategories(pdfId);
    return pdfCategoriesData;
  };

  PdfCategory.getPdfCategories = async function (pdfId) {
    const categories = await PdfCategory.findAll({
      where: {
        pdf_id: pdfId
      },
      include: [
        {
          model: allModels.Category,
          as: 'category',
          attributes: ['name']
        },
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

    return categories;
  };

  return PdfCategory;
};
