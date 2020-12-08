const path = require('path');

const userRolesPolicy = require(path.resolve('./modules/userRoles/userRoles.policy'));
const rules = require(path.resolve('./modules/userRoles/userRoles.validator'));
const auth = require(path.resolve('./utilities/auth'));
const userRoleController = require(path.resolve('./modules/userRoles/userRoles.controller'));

module.exports = function (router) {
  router.post(
    '/api/user/:userId/userRole/:roleId',
    auth.verifyToken,
    userRolesPolicy.isAllowed,
    rules.addRules,
    rules.verifyRules,
    userRoleController.add
  );

  router.delete(
    '/api/user/:userId/userRole/:roleId',
    auth.verifyToken,
    userRolesPolicy.isAllowed,
    rules.destroyRules,
    rules.verifyRules,
    userRoleController.destroy
  );
};
