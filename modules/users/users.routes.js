const path = require('path');

const userPolicy = require(path.resolve('./modules/users/users.policy'));
const rules = require(path.resolve('./modules/users/users.validator'));
const userController = require(path.resolve('./modules/users/users.controller'));

module.exports = function (router) {
  router.post(
    '/api/login',
    userPolicy.isAllowed,
    rules.loginRules,
    rules.verifyRules,
    userController.signin
  );

  router.post(
    '/api/register',
    userPolicy.isAllowed,
    rules.registerRules,
    rules.verifyRules,
    userController.register
  );
};
