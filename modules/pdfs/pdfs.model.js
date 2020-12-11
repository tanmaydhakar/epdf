const { Model, Op } = require('sequelize');

let allModels;

module.exports = (sequelize, DataTypes) => {
  class Pdf extends Model {
    static associate(models) {
      this.hasMany(models.PdfPreviews, { as: 'previews', foreignKey: 'pdf_id' });
      this.hasMany(models.PdfCategory, { as: 'categorys', foreignKey: 'pdf_id' });
      this.hasOne(models.User, { as: 'user', sourceKey: 'user_id', foreignKey: 'id' });
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
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
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
    const {
      title,
      pdf_url,
      author,
      short_description,
      access_type,
      categories,
      previews
    } = data.body;

    const pdfDataPayload = {
      title,
      pdf_url,
      author,
      short_description,
      access_type,
      user_id: data.user.id
    };

    let pdf = await Pdf.create(pdfDataPayload);

    for (let i = 0; i < previews.length; i += 1) {
      const pdfPreview = new allModels.PdfPreviews();

      pdfPreview.image_url = previews[i];
      pdfPreview.pdf_id = pdf.id;
      await pdfPreview.save();
    }

    const categoriesData = await allModels.PdfCategory.getCategoriesId(categories);

    for (let i = 0; i <= categoriesData.length - 1; i += 1) {
      const pdfCategory = new allModels.PdfCategory();
      pdfCategory.pdf_id = pdf.id;
      pdfCategory.category_id = categoriesData[i].id;

      await pdfCategory.save();
    }

    pdf = await this.getPdf(pdf.id);
    return pdf;
  };

  Pdf.index = async function (data) {
    const { author, title, sort } = data.query;
    let { page } = data.query;

    page = page && !isNaN(page) ? parseInt(page) - 1 : 0;
    const limit = 10;
    const offset = page * limit;
    let whereStatement;
    const sortBy = [];

    if (!data.user.roles.includes('Admin')) {
      whereStatement = {
        [Op.or]: [
          {
            access_type: 'Public'
          },
          {
            user_id: data.user.id
          }
        ]
      };
    } else {
      whereStatement = {};
    }

    if (title) {
      whereStatement.title = {
        [Op.like]: `${title}%`
      };
    }
    if (author) {
      whereStatement.author = {
        [Op.like]: `${author}%`
      };
    }

    if (sort && sort === 'title') {
      sortBy.push(['title', 'asc']);
    } else if (sort && sort === 'author') {
      sortBy.push(['author', 'asc']);
    } else {
      sortBy.push(['createdAt', 'desc']);
    }

    const pdfs = await Pdf.findAndCountAll({
      where: whereStatement,
      order: sortBy,
      offset,
      limit,
      include: [
        { model: allModels.PdfPreviews, as: 'previews', attributes: ['image_url'] },
        { model: allModels.User, as: 'user', attributes: ['id', 'username', 'email'] },
        {
          model: allModels.Category,
          as: 'categories',
          attributes: ['name'],
          through: {
            attributes: []
          }
        }
      ]
    });
    return pdfs;
  };

  Pdf.updatePdf = async function (data) {
    const { pdfId } = data.params;
    const {
      title,
      pdf_url,
      author,
      short_description,
      access_type,
      previews,
      categories
    } = data.body;

    let pdf = await Pdf.findByPk(pdfId);
    pdf.title = title;
    pdf.pdf_url = pdf_url;
    pdf.author = author;
    pdf.short_description = short_description;
    pdf.access_type = access_type;
    await pdf.save();

    const previewsData = await pdf.getPreviews();
    const oldPreviews = previewsData.filter(
      previewObject => !previews.includes(previewObject.image_url)
    );

    for (let i = 0; i < oldPreviews.length; i += 1) {
      await oldPreviews[i].destroy();
    }
    for (let i = 0; i < previews.length; i += 1) {
      await allModels.PdfPreviews.findOrCreate({
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

    const categoriesData = await allModels.PdfCategory.getCategoriesId(categories);
    await pdf.setCategories(categoriesData);

    pdf = await this.getPdf(pdf.id);
    return pdf;
  };

  Pdf.getPdf = async function (pdfId) {
    const pdf = await Pdf.findOne({
      where: {
        id: pdfId
      },
      attributes: ['id', 'title', 'pdf_url', 'author', 'short_description', 'access_type'],
      include: [
        { model: allModels.PdfPreviews, as: 'previews', attributes: ['image_url'] },
        { model: allModels.User, as: 'user', attributes: ['id', 'username', 'email'] },
        {
          model: allModels.Category,
          as: 'categories',
          attributes: ['name'],
          through: {
            attributes: []
          }
        }
      ]
    });

    return pdf;
  };

  return Pdf;
};
