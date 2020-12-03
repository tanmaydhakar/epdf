const path = require('path');

const pdfPreviewPolicy = require(path.resolve('./modules/pdfPreviews/pdfPreviews.policy'));
const rules = require(path.resolve('./modules/pdfPreviews/pdfPreviews.validator'));
const auth = require(path.resolve('./utilities/auth'));
const pdfPreviewController = require(path.resolve('./modules/pdfPreviews/pdfPreviews.controller'));

module.exports = function (router) {
  router.get(
    '/api/pdf/:pdfId/pdfPreview',
    auth.verifyToken,
    pdfPreviewPolicy.isAllowed,
    rules.getRules,
    rules.verifyRules,
    pdfPreviewController.show
  );

  router.post(
    '/api/pdf/:pdfId/pdfPreview',
    auth.verifyToken,
    pdfPreviewPolicy.isAllowed,
    rules.createRules,
    rules.verifyRules,
    pdfPreviewController.create
  );

  router.patch(
    '/api/pdf/:pdfId/pdfPreview',
    auth.verifyToken,
    pdfPreviewPolicy.isAllowed,
    rules.updateRules,
    rules.verifyRules,
    pdfPreviewController.update
  );
};
