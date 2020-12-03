const path = require('path');

const errorHandler = require(path.resolve('./utilities/errorHandler'));
const serializer = require(path.resolve('./modules/userProfiles/userProfiles.serializer'));
const db = require(path.resolve('./models'));
const { UserProfile } = db;

const update = async function (req, res) {
  try {
    const userProfile = await UserProfile.updateUserProfile(req);

    const responseData = await serializer.userProfile(userProfile);
    return res.status(200).json({ userProfile: responseData });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

const show = async function (req, res) {
  try {
    const userProfile = await UserProfile.getUserProfile(req.body.user_id);

    const responseData = await serializer.userProfile(userProfile);
    return res.status(200).json({ userProfile: responseData });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

module.exports = {
  update,
  show
};
