const path = require('path');

const rules = require(path.resolve('./modules/userProfiles/userProfiles.validator'));
const auth = require(path.resolve('./utilities/auth'));
const userProfilesController = require(path.resolve(
  './modules/userProfiles/userProfiles.controller'
));

module.exports = function (router) {
  router.patch(
    '/api/userProfile',
    auth.verifyToken,
    rules.updateRules,
    rules.verifyRules,
    userProfilesController.update
  );

  router.get(
    '/api/userProfile',
    auth.verifyToken,
    rules.showRules,
    rules.verifyRules,
    userProfilesController.show
  );
};
