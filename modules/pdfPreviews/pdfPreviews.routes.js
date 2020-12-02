const path = require('path');

const rules = require(path.resolve('./modules/pdfPreviews/pdfPreviews.validator'));
const auth = require(path.resolve('./utilities/auth'));
const pdfPreviewController = require(path.resolve('./modules/pdfPreviews/pdfPreviews.controller'));

module.exports = function (router) {
  router.get(
    '/api/pdfPreview',
    auth.verifyToken,
    rules.getRules,
    rules.verifyRules,
    pdfPreviewController.show
  );

  router.post(
    '/api/pdfPreview',
    auth.verifyToken,
    rules.createRules,
    rules.verifyRules,
    pdfPreviewController.create
  );

  router.patch(
    '/api/pdfPreview',
    auth.verifyToken,
    rules.updateRules,
    rules.verifyRules,
    pdfPreviewController.update
  );
};
