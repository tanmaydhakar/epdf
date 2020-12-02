const path = require('path');

const rules = require(path.resolve('./modules/pdfPreviews/pdfPreviews.validator'));
const auth = require(path.resolve('./utilities/auth'));
const customPolicy = require(path.resolve('./modules/pdfs/pdfs.custom.policy'));
const pdfPreviewController = require(path.resolve('./modules/pdfPreviews/pdfPreviews.controller'));

module.exports = function (router) {
  router.get(
    '/api/pdfPreview',
    auth.verifyToken,
    rules.getRules,
    rules.verifyRules,
    customPolicy.pdfAccessValidator,
    pdfPreviewController.list
  );

  router.post(
    '/api/pdfPreview',
    auth.verifyToken,
    rules.createRules,
    rules.verifyRules,
    customPolicy.pdfAccessValidator,
    pdfPreviewController.create
  );

  router.patch(
    '/api/pdfPreview',
    auth.verifyToken,
    rules.updateRules,
    rules.verifyRules,
    customPolicy.pdfAccessValidator,
    pdfPreviewController.update
  );
};
