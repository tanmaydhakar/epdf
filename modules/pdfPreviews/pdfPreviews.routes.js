const path = require('path');

const pdfPreviewPolicy = require(path.resolve('./modules/pdfPreviews/pdfPreviews.policy'));
const rules = require(path.resolve('./modules/pdfPreviews/pdfPreviews.validator'));
const auth = require(path.resolve('./utilities/auth'));
const pdfPreviewController = require(path.resolve('./modules/pdfPreviews/pdfPreviews.controller'));

module.exports = function (router) {
  router.get(
    '/api/pdf/:pdfId/pdfPreviews',
    auth.verifyToken,
    pdfPreviewPolicy.isAllowed,
    rules.getRules,
    rules.verifyRules,
    pdfPreviewController.show
  );
};
