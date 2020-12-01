const { Model } = require('sequelize');

let allModels;

module.exports = (sequelize, DataTypes) => {
  class Pdf extends Model {
    static associate(models) {
      this.hasMany(models.PdfPreviews, { as: 'previews', foreignKey: 'pdf_id' });
      this.hasMany(models.PdfCategory, { as: 'categorys', foreignKey: 'pdf_id' });
      this.belongsToMany(models.Category, {
        as: 'categories',
        through: models.PdfCategory,
        foreignKey: 'pdf_id',
        otherKey: 'category_id'
      });
    }
  }
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

  Pdf.beforeDestroy(async pdf => {
    const previews = await pdf.getPreviews();
    if (previews.length) {
      for (let i = 0; i <= previews.length - 1; i += 1) {
        await previews[i].destroy();
      }
    }

    const categories = await pdf.getCategorys();
    if (categories.length) {
      for (let i = 0; i <= categories.length - 1; i += 1) {
        await categories[i].destroy();
      }
    }
  });

  Pdf.registerModels = function (models) {
    allModels = models;
  };

  Pdf.findBySpecificField = async function (fields) {
    const queryOptions = {
      where: fields
    };

    const pdf = await Pdf.findOne(queryOptions);
    return pdf;
  };

  Pdf.createPdf = async function (data) {
    const pdfData = data.body;

    const pdfDataPayload = {
      title: pdfData.title,
      pdf_url: pdfData.pdf_url,
      author: pdfData.author,
      short_description: pdfData.short_description,
      access_type: pdfData.access_type,
      user_id: data.user.id
    };

    const pdf = await Pdf.create(pdfDataPayload);

    return pdf;
  };

  Pdf.index = async function (data) {
    const whereStatement = {};
    const sortBy = [];

    if (!data.user.roles.includes('Admin')) {
      whereStatement.user_id = data.user.id;
    }

    if (data.query.sort === 'title') {
      sortBy.push(['title', 'asc']);
    } else if (data.query.sort === 'author') {
      sortBy.push(['author', 'asc']);
    } else {
      sortBy.push(['createdAt', 'desc']);
    }

    const pdfs = await Pdf.findAll({
      where: whereStatement,
      order: sortBy,
      include: [
        { model: allModels.PdfPreviews, as: 'previews', attributes: ['image_url'] },
        { model: allModels.Category, as: 'categories', attributes: ['name'] }
      ]
    });

    return pdfs;
  };

  Pdf.update = async function (data) {
    const pdfData = data.body;
    const { pdfId } = data.params;

    const pdf = await Pdf.findByPk(pdfId);
    pdf.title = pdfData.title;
    pdf.pdf_url = pdfData.pdf_url;
    pdf.author = pdfData.author;
    pdf.short_description = pdfData.short_description;
    pdf.access_type = pdfData.access_type;
    await pdf.save();

    return pdf;
  };

  return Pdf;
};
