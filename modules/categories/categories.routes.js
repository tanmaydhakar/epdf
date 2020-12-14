const path = require('path');

const rules = require(path.resolve('./modules/categories/categories.validator'));
const auth = require(path.resolve('./utilities/auth'));
const categoriesPolicy = require(path.resolve('./modules/categories/categories.policy'));
const categoriesController = require(path.resolve('./modules/categories/categories.controller'));

module.exports = function (router) {
  router.get('/api/categories', auth.verifyToken, categoriesController.index);

  router.post(
    '/api/categories',
    auth.verifyToken,
    categoriesPolicy.isAllowed,
    rules.addRules,
    rules.verifyRules,
    categoriesController.add
  );

  router.patch(
    '/api/categories/:categoryId',
    auth.verifyToken,
    categoriesPolicy.isAllowed,
    rules.updateRules,
    rules.verifyRules,
    categoriesController.update
  );

  router.delete(
    '/api/categories/:categoryId',
    auth.verifyToken,
    categoriesPolicy.isAllowed,
    rules.destroyRules,
    rules.verifyRules,
    categoriesController.destroy
  );

  router.get(
    '/api/categories-count',
    auth.verifyToken,
    categoriesPolicy.isAllowed,
    categoriesController.count
  );
};
