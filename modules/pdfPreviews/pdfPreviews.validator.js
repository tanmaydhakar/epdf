const path = require('path');
const { body, validationResult } = require('express-validator');

const db = require(path.resolve('./models'));
const { Pdf } = db;

const getRules = [
  body('pdfId')
    .exists()
    .withMessage('pdfId does not exists')
    .custom(async value => {
      const pdf = await Pdf.findByPk(value);
      if (!pdf) {
        return Promise.reject(new Error('invalid pdfId'));
      }
      return true;
    })
];

const updateRules = [
  body('pdfId')
    .exists()
    .withMessage('pdfId does not exists')
    .custom(async value => {
      const pdf = await Pdf.findByPk(value);
      if (!pdf) {
        return Promise.reject(new Error('invalid pdfId'));
      }
      return true;
    })
];

const verifyRules = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array().shift();
    return res.status(422).json({ message: error });
  }
  return next();
};

module.exports = {
  verifyRules,
  getRules,
  updateRules
};
