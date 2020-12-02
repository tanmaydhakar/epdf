const path = require('path');

const rules = require(path.resolve('./modules/pdfCategories/pdfCategories.validator'));
const auth = require(path.resolve('./utilities/auth'));
const pdfCategoriesController = require(path.resolve(
  './modules/pdfCategories/pdfCategories.controller'
));

module.exports = function (router) {
  router.get(
    '/api/pdfCategories',
    auth.verifyToken,
    rules.getRules,
    rules.verifyRules,
    pdfCategoriesController.show
  );

  router.post(
    '/api/pdfCategories',
    auth.verifyToken,
    rules.createRules,
    rules.verifyRules,
    pdfCategoriesController.create
  );

  router.patch(
    '/api/pdfCategories',
    auth.verifyToken,
    rules.updateRules,
    rules.verifyRules,
    pdfCategoriesController.update
  );
};
