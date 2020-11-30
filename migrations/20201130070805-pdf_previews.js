module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pdf_previews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      image_url: {
        type: Sequelize.STRING
      },
      pdf_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'pdfs',
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
    await queryInterface.dropTable('pdf_previews');
  }
};
