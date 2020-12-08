const path = require('path');

const serializer = require(path.resolve('./modules/userProfiles/userProfiles.serializer'));
const db = require(path.resolve('./models'));
const { UserProfile } = db;

const update = async function (req, res) {
  const userProfile = await UserProfile.updateUserProfile(req);

  const responseData = await serializer.userProfile(userProfile);
  return res.status(200).json({ userProfile: responseData });
};

const show = async function (req, res) {
  const userProfile = await UserProfile.getUserProfile(req.params.userId);

  const responseData = await serializer.userProfile(userProfile);
  return res.status(200).json({ userProfile: responseData });
};

module.exports = {
  update,
  show
};
