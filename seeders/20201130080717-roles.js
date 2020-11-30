module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roles', [
      {
        name: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Reader',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Author',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Publication House',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Parttime Blogger',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
