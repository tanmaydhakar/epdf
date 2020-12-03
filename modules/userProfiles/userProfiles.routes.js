const path = require('path');

const userProfilePolicy = require(path.resolve('./modules/userProfiles/userProfiles.policy'));
const rules = require(path.resolve('./modules/userProfiles/userProfiles.validator'));
const auth = require(path.resolve('./utilities/auth'));
const userProfilesController = require(path.resolve(
  './modules/userProfiles/userProfiles.controller'
));

module.exports = function (router) {
  router.patch(
    '/api/user/:userId/userProfile',
    auth.verifyToken,
    userProfilePolicy.isAllowed,
    rules.updateRules,
    rules.verifyRules,
    userProfilesController.update
  );

  router.get(
    '/api/user/:userId/userProfile',
    auth.verifyToken,
    userProfilePolicy.isAllowed,
    rules.showRules,
    rules.verifyRules,
    userProfilesController.show
  );
};
