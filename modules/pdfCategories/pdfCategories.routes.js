const path = require('path');

const pdfCategoryPolicy = require(path.resolve('./modules/pdfCategories/pdfCategories.policy'));
const rules = require(path.resolve('./modules/pdfCategories/pdfCategories.validator'));
const auth = require(path.resolve('./utilities/auth'));
const pdfCategoriesController = require(path.resolve(
  './modules/pdfCategories/pdfCategories.controller'
));

module.exports = function (router) {
  router.get(
    '/api/pdf/:pdfId/pdfCategories',
    auth.verifyToken,
    pdfCategoryPolicy.isAllowed,
    rules.getRules,
    rules.verifyRules,
    pdfCategoriesController.show
  );
};
