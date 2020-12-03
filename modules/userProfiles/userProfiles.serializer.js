const userProfile = async function (userProfile) {
  const finalUserProfile = {};

  finalUserProfile.id = userProfile.id;
  finalUserProfile.first_name = userProfile.first_name;
  finalUserProfile.last_name = userProfile.last_name;
  finalUserProfile.full_name = userProfile.full_name;
  finalUserProfile.phone = userProfile.phone;
  finalUserProfile.city = userProfile.city;
  finalUserProfile.state = userProfile.state;
  finalUserProfile.user = userProfile.user;

  return finalUserProfile;
};

module.exports = {
  userProfile
};
