const path = require('path');

const rules = require(path.resolve('./modules/categories/categories.validator'));
const auth = require(path.resolve('./utilities/auth'));
const categoriesController = require(path.resolve('./modules/categories/categories.controller'));

module.exports = function (router) {
  router.get('/api/categories', auth.verifyToken, categoriesController.index);

  router.post(
    '/api/categories',
    auth.verifyToken,
    rules.addRules,
    rules.verifyRules,
    categoriesController.add
  );

  router.patch(
    '/api/categories/:categoryId',
    auth.verifyToken,
    rules.updateRules,
    rules.verifyRules,
    categoriesController.update
  );

  router.delete(
    '/api/categories/:categoryId',
    auth.verifyToken,
    rules.destroyRules,
    rules.verifyRules,
    categoriesController.destroy
  );
};
