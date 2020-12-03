const path = require('path');
const { body, validationResult } = require('express-validator');

const db = require(path.resolve('./models'));
const { User } = db;

const updateRules = [
  body('user_id')
    .exists()
    .withMessage('user_id does not exists')
    .custom(async (value, { req }) => {
      const user = await User.findByPk(value);

      if (!user) {
        return Promise.reject(new Error('invalid user_id'));
      }
      if (req.user.id !== value && !req.user.roles.includes('Admin')) {
        return Promise.reject(new Error('You dont have permission to access this resource'));
      }
      return true;
    }),

  body('first_name')
    .exists()
    .withMessage('first_name does not exists')
    .isString()
    .withMessage('first_name must be string')
    .trim()
    .isLength({
      min: 1
    })
    .withMessage('first_name should be minimum 1 characters'),

  body('last_name')
    .exists()
    .withMessage('last_name does not exists')
    .isString()
    .withMessage('last_name must be string')
    .trim()
    .isLength({
      min: 1
    })
    .withMessage('last_name should be minimum 1 characters'),

  body('phone')
    .exists()
    .withMessage('phone does not exists')
    .isString()
    .withMessage('phone must be string')
    .trim()
    .isLength({
      min: 10,
      max: 13
    })
    .withMessage('phone should be minimum 10 and a maximum of 13 characters'),

  body('city')
    .exists()
    .withMessage('city does not exists')
    .isString()
    .withMessage('city must be string')
    .trim()
    .isLength({
      min: 2
    })
    .withMessage('city should be minimum 2 characters'),

  body('state')
    .exists()
    .withMessage('state does not exists')
    .isString()
    .withMessage('state must be string')
    .trim()
    .isLength({
      min: 2
    })
    .withMessage('state should be minimum 2 characters')
];

const showRules = [
  body('user_id')
    .exists()
    .withMessage('user_id does not exists')
    .custom(async (value, { req }) => {
      const user = await User.findByPk(value);

      if (!user) {
        return Promise.reject(new Error('invalid user_id'));
      }
      if (req.user.id !== value && !req.user.roles.includes('Admin')) {
        return Promise.reject(new Error('You dont have permission to access this resource'));
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
  updateRules,
  showRules
};
