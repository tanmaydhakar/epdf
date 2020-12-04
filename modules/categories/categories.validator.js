const path = require('path');
const { body, validationResult, param } = require('express-validator');

const db = require(path.resolve('./models'));
const { Category } = db;

const addRules = [
  body('name')
    .exists()
    .withMessage('name does not exists')
    .isString()
    .withMessage('name must be string')
    .trim()
    .isLength({
      min: 1
    })
    .withMessage('name should be minimum 1 characters')
    .custom(async value => {
      const field = {
        name: value
      };
      const category = await Category.findBySpecificField(field);
      if (category) {
        return Promise.reject(new Error('category with this name already exists'));
      }
      return true;
    })
];

const updateRules = [
  param('categoryId').custom(async value => {
    const category = await Category.findByPk(value);
    if (!category) {
      return Promise.reject(new Error('invalid categoryId'));
    }
    return true;
  }),

  body('name')
    .exists()
    .withMessage('name does not exists')
    .isString()
    .withMessage('name must be string')
    .trim()
    .isLength({
      min: 1
    })
    .withMessage('name should be minimum 1 characters')
    .custom(async value => {
      const field = {
        name: value
      };
      const category = await Category.findBySpecificField(field);
      if (category) {
        return Promise.reject(new Error('category with this name already exists'));
      }
      return true;
    })
];

const destroyRules = [
  param('categoryId').custom(async value => {
    const category = await Category.findByPk(value);
    if (!category) {
      return Promise.reject(new Error('invalid categoryId'));
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
  addRules,
  updateRules,
  destroyRules
};
