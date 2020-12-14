const path = require('path');

const rules = require(path.resolve('./modules/pdfs/pdfs.validator'));
const auth = require(path.resolve('./utilities/auth'));
const pdfPolicy = require(path.resolve('./modules/pdfs/pdfs.policy'));
const pdfController = require(path.resolve('./modules/pdfs/pdfs.controller'));

module.exports = function (router) {
  router.post(
    '/api/pdf',
    auth.verifyToken,
    pdfPolicy.isAllowed,
    rules.createRules,
    rules.verifyRules,
    pdfController.create
  );

  router.get('/api/pdfs', auth.verifyToken, pdfPolicy.isAllowed, pdfController.index);

  router.get(
    '/api/pdf/:pdfId',
    auth.verifyToken,
    pdfPolicy.isAllowed,
    rules.showRules,
    rules.verifyRules,
    pdfController.show
  );

  router.patch(
    '/api/pdf/:pdfId',
    auth.verifyToken,
    pdfPolicy.isAllowed,
    rules.updateRules,
    rules.verifyRules,
    pdfController.update
  );

  router.delete(
    '/api/pdf/:pdfId',
    auth.verifyToken,
    pdfPolicy.isAllowed,
    rules.destroyRules,
    rules.verifyRules,
    pdfController.destroy
  );

  router.get('/api/pdf-count', auth.verifyToken, pdfPolicy.isAllowed, pdfController.count);
};
