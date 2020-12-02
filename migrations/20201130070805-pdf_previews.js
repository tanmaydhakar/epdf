module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pdf_previews', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      image_url: {
        type: Sequelize.STRING
      },
      pdf_id: {
        allowNull: false,
        type: Sequelize.UUID,
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
