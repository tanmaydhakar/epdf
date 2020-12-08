const path = require('path');

const rolePolicy = require(path.resolve('./modules/roles/roles.policy'));
const auth = require(path.resolve('./utilities/auth'));
const roleController = require(path.resolve('./modules/roles/roles.controller'));

module.exports = function (router) {
  router.get('/api/roles', auth.verifyToken, rolePolicy.isAllowed, roleController.index);
};
