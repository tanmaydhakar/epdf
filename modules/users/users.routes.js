const path = require('path');

const rules = require(path.resolve('./modules/users/users.validator'));
const userController = require(path.resolve('./modules/users/users.controller'));

module.exports = function (router) {
  router.post('/api/login', rules.loginRules, rules.verifyRules, userController.signin);

  router.post('/api/register', rules.registerRules, rules.verifyRules, userController.register);
};
