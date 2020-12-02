const path = require('path');
const { body, validationResult } = require('express-validator');

const db = require(path.resolve('./models'));
const { Pdf, Category } = db;

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

const createRules = [
  body('pdfId')
    .exists()
    .withMessage('pdfId does not exists')
    .custom(async value => {
      const pdf = await Pdf.findByPk(value);
      if (!pdf) {
        return Promise.reject(new Error('invalid pdfId'));
      }
      return true;
    }),

  body('categories')
    .exists()
    .withMessage('categories does not exists')
    .custom(async value => {
      if (!Array.isArray(value)) {
        return Promise.reject(new Error('categories must be array'));
      }
      for (let i = 0; i <= value.length - 1; i += 1) {
        const field = {
          name: value[0]
        };
        const category = await Category.findBySpecificField(field);
        if (!category) {
          return Promise.reject(new Error('invalid category'));
        }
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
    }),

  body('categories')
    .exists()
    .withMessage('categories does not exists')
    .custom(async value => {
      if (!Array.isArray(value)) {
        return Promise.reject(new Error('categories must be array'));
      }
      for (let i = 0; i <= value.length - 1; i += 1) {
        const field = {
          name: value[0]
        };
        const category = await Category.findBySpecificField(field);
        if (!category) {
          return Promise.reject(new Error('invalid category'));
        }
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
  createRules,
  updateRules
};
