const path = require('path');
const { body, validationResult, param } = require('express-validator');

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
        return Promise.reject(new Error('You dont have permission to access this resource'));
      }
      return true;
    })
];

const createRules = [
  param('pdfId')
    .exists()
    .withMessage('pdfId does not exists')
    .custom(async (value, { req }) => {
      const pdf = await Pdf.findByPk(value);
      if (!pdf) {
        return Promise.reject(new Error('invalid pdfId'));
      }
      if (pdf.user_id !== req.user.id && !req.user.roles.includes('Admin')) {
        return Promise.reject(new Error('You dont have permission to access this resource'));
      }
      const previews = await pdf.getPreviews();
      if (previews.length) {
        return Promise.reject(new Error('previews already exists for this pdf'));
      }
      return true;
    }),

  body('previews')
    .exists()
    .withMessage('previews does not exists')
    .custom(async value => {
      if (!Array.isArray(value)) {
        return Promise.reject(new Error('categories must be array'));
      }
      for (let i = 0; i <= value.length - 1; i += 1) {
        if (typeof value[i] !== 'string') {
          return Promise.reject(new Error('invalid category'));
        }
      }
      return true;
    })
];

const updateRules = [
  param('pdfId')
    .exists()
    .withMessage('pdfId does not exists')
    .custom(async (value, { req }) => {
      const pdf = await Pdf.findByPk(value);
      if (!pdf) {
        return Promise.reject(new Error('invalid pdfId'));
      }
      if (pdf.user_id !== req.user.id && !req.user.roles.includes('Admin')) {
        return Promise.reject(new Error('You dont have permission to access this resource'));
      }
      return true;
    }),

  body('previews')
    .exists()
    .withMessage('previews does not exists')
    .custom(async value => {
      if (!Array.isArray(value)) {
        return Promise.reject(new Error('categories must be array'));
      }
      for (let i = 0; i <= value.length - 1; i += 1) {
        if (typeof value[i] !== 'string') {
          return Promise.reject(new Error('previews must contain only string'));
        }
      }
      return true;
    })
];

const verifyRules = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array().shift();
    if (error.msg === 'You dont have permission to access this resource') {
      return res.status(403).json({ message: error });
    }
    return res.status(422).json({ message: error });
  }
  return next();
};

module.exports = {
  verifyRules,
  getRules,
  createRules,
  updateRules
};
