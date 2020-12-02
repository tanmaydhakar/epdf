const path = require('path');

const rules = require(path.resolve('./modules/pdfCategories/pdfCategories.validator'));
const auth = require(path.resolve('./utilities/auth'));
const customPolicy = require(path.resolve('./modules/pdfs/pdfs.custom.policy'));
const pdfCategoriesController = require(path.resolve(
  './modules/pdfCategories/pdfCategories.controller'
));

module.exports = function (router) {
  router.get(
    '/api/pdfCategories',
    auth.verifyToken,
    rules.getRules,
    rules.verifyRules,
    customPolicy.pdfAccessValidator,
    pdfCategoriesController.list
  );

  router.post(
    '/api/pdfCategories',
    auth.verifyToken,
    rules.createRules,
    rules.verifyRules,
    customPolicy.pdfAccessValidator,
    pdfCategoriesController.create
  );

  router.patch(
    '/api/pdfCategories',
    auth.verifyToken,
    rules.updateRules,
    rules.verifyRules,
    customPolicy.pdfAccessValidator,
    pdfCategoriesController.update
  );
};
