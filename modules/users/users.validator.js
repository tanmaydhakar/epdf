const path = require('path');

const db = require(path.resolve('./models'));
const { body, validationResult, param } = require('express-validator');

const { User, Role } = db;

const registerRules = [
  body('username')
    .exists()
    .withMessage('username does not exists')
    .isString()
    .withMessage('username must be string')
    .trim()
    .isLength({
      min: 5
    })
    .withMessage('username should be minimum 5 characters')
    .custom(value => {
      const field = {
        username: value
      };
      return User.findBySpecificField(field).then(user => {
        if (user) {
          return Promise.reject(new Error('username already exists'));
        }
        return true;
      });
    }),

  body('email')
    .exists()
    .withMessage('email does not exists')
    .isEmail()
    .withMessage('Invalid email format')
    .trim()
    .custom(value => {
      const field = {
        email: value
      };
      return User.findBySpecificField(field).then(user => {
        if (user) {
          return Promise.reject(new Error('Email already exists'));
        }
        return true;
      });
    }),

  body('password')
    .exists()
    .withMessage('password does not exists')
    .notEmpty()
    .withMessage('password should not be empty')
    .isString()
    .withMessage('password must be string')
    .isLength({
      min: 6
    })
    .withMessage('password should be minimum 6 characters')
    .matches(/(?=.*[a-z])/, 'i')
    .withMessage('Password should contain atleast one small letter')
    .matches(/(?=.*[A-Z])/, 'i')
    .withMessage('Password should contain atleast one capital letter')
    .matches(/[-+_!@#$%^&*.,?]/, 'i')
    .withMessage('Password should contain atleast one special character'),

  body('role').custom(async value => {
    if (!value) {
      return true;
    }
    const field = {
      name: value
    };
    const role = await Role.findBySpecificField(field);
    if (!role || role.name === 'Admin') {
      return Promise.reject(new Error('role is invalid'));
    }
    return true;
  })
];

const loginRules = [
  body('username')
    .exists()
    .withMessage('username does not exists')
    .custom(value => {
      const field = {
        username: value
      };
      return User.findBySpecificField(field).then(user => {
        if (!user) {
          return Promise.reject(new Error('username is invalid'));
        }
        return true;
      });
    }),
  body('password')
    .exists()
    .withMessage('password does not exists')
    .notEmpty()
    .withMessage('password should not be empty')
];

const destroyRules = [
  param('userId').custom(async value => {
    const user = await User.findByPk(value);
    if (!user) {
      return Promise.reject(new Error('userId is invalid'));
    }
    const roles = await user.getRoles();

    if (roles.length) {
      const isAdmin = roles.find(role => role.name === 'Admin');
      if (isAdmin) {
        return Promise.reject(new Error('admin can not be deleted'));
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
  registerRules,
  loginRules,
  destroyRules
};
