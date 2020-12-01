module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('categories', [
      {
        name: 'Nonfiction',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fiction',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Biography',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Philosophy',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fantasy',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
