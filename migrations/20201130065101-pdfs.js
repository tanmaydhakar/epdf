module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pdfs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      pdf_url: {
        allowNull: false,
        type: Sequelize.STRING
      },
      author: {
        allowNull: false,
        type: Sequelize.STRING
      },
      short_description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      access_type: {
        allowNull: false,
        type: Sequelize.ENUM('Public', 'Private'),
        defaultValue: 'Public'
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
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
    await queryInterface.dropTable('pdfs');
  }
};
