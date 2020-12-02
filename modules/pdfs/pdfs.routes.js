const path = require('path');

const rules = require(path.resolve('./modules/pdfs/pdfs.validator'));
const auth = require(path.resolve('./utilities/auth'));
const customPolicy = require(path.resolve('./modules/pdfs/pdfs.custom.policy'));
const pdfController = require(path.resolve('./modules/pdfs/pdfs.controller'));

module.exports = function (router) {
  router.post(
    '/api/pdf',
    auth.verifyToken,
    rules.createRules,
    rules.verifyRules,
    pdfController.create
  );

  router.get('/api/pdfs', auth.verifyToken, pdfController.index);

  router.get(
    '/api/pdf/:pdfId',
    auth.verifyToken,
    rules.showRules,
    rules.verifyRules,
    customPolicy.pdfAccessValidator,
    pdfController.show
  );

  router.patch(
    '/api/pdf/:pdfId',
    auth.verifyToken,
    rules.updateRules,
    rules.verifyRules,
    pdfController.update
  );

  router.delete(
    '/api/pdf/:pdfId',
    auth.verifyToken,
    rules.destroyRules,
    rules.verifyRules,
    pdfController.destroy
  );
};
