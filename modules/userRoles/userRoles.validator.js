const path = require('path');
const { validationResult, param } = require('express-validator');

const db = require(path.resolve('./models'));
const { UserRole, User, Role } = db;

const addRules = [
  param('userId').custom(async (value, { req }) => {
    const user = await User.findByPk(value);
    if (!user) {
      return Promise.reject(new Error('invalid userId'));
    }
    if (user.id !== req.user.id && !req.user.roles.includes('Admin')) {
      return Promise.reject(new Error('user is unauthorized to access this resource'));
    }
    return true;
  }),

  param('roleId').custom(async (value, { req }) => {
    const role = await Role.findByPk(value);
    if (!role || role.name === 'Admin') {
      return Promise.reject(new Error('invalid roleId'));
    }

    const userRoles = await UserRole.findAll({
      where: {
        user_id: req.params.userId
      },
      attributes: [],
      include: [{ model: Role, as: 'role', attributes: ['name'] }]
    });

    const roleExists = userRoles.find(userRole => userRole.role.name === role.name);
    if (roleExists) {
      return Promise.reject(new Error('role already belongs to this user'));
    }
    return true;
  })
];

const destroyRules = [
  param('userId').custom(async (value, { req }) => {
    const user = await User.findByPk(value);
    if (!user) {
      return Promise.reject(new Error('invalid userId'));
    }
    if (user.id !== req.user.id && !req.user.roles.includes('Admin')) {
      return Promise.reject(new Error('user is unauthorized to access this resource'));
    }
    return true;
  }),

  param('roleId').custom(async (value, { req }) => {
    const role = await Role.findByPk(value);
    if (!role || role.name === 'Admin') {
      return Promise.reject(new Error('invalid roleId'));
    }
    if (role.name === 'Reader') {
      return Promise.reject(new Error('you cant delete this role'));
    }

    const userRoles = await UserRole.findAll({
      where: {
        user_id: req.params.userId
      },
      attributes: [],
      include: [{ model: Role, as: 'role', attributes: ['name'] }]
    });

    const roleExists = userRoles.find(userRole => userRole.role.name === role.name);
    if (!roleExists) {
      return Promise.reject(new Error('role does not belongs to this user'));
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
  destroyRules
};
