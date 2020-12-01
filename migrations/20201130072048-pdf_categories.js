module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pdf_categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pdf_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'pdfs',
          key: 'id'
        }
      },
      category_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'categories',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pdf_categories');
  }
};
