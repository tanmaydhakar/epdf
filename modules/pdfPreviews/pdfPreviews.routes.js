const path = require('path');

const rules = require(path.resolve('./modules/pdfPreviews/pdfPreviews.validator'));
const auth = require(path.resolve('./utilities/auth'));
const pdfPreviewController = require(path.resolve('./modules/pdfPreviews/pdfPreviews.controller'));

module.exports = function (router) {
  router.get(
    '/api/pdf/:pdfId/pdfPreview',
    auth.verifyToken,
    rules.getRules,
    rules.verifyRules,
    pdfPreviewController.show
  );

  router.post(
    '/api/pdf/:pdfId/pdfPreview',
    auth.verifyToken,
    rules.createRules,
    rules.verifyRules,
    pdfPreviewController.create
  );

  router.patch(
    '/api/pdf/:pdfId/pdfPreview',
    auth.verifyToken,
    rules.updateRules,
    rules.verifyRules,
    pdfPreviewController.update
  );
};
