const path = require('path');
const { validationResult, param } = require('express-validator');

const db = require(path.resolve('./models'));
const { Pdf } = db;

const getRules = [
  param('pdfId')
    .exists()
    .withMessage('pdfId does not exists')
    .custom(async (value, { req }) => {
      const pdf = await Pdf.findByPk(value);
      if (!pdf) {
        return Promise.reject(new Error('invalid pdfId'));
      }
      if (pdf.user_id !== req.user.id && !req.user.roles.includes('Admin')) {
        return Promise.reject(new Error('user is unauthorized to access this resource'));
      }
      return true;
    })
];

const verifyRules = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array().shift();
    if (error.msg === 'user is unauthorized to access this resource') {
      return res.status(403).json({ message: error });
    }
    return res.status(422).json({ message: error });
  }
  return next();
};

module.exports = {
  verifyRules,
  getRules
};
