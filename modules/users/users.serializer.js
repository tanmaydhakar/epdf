const registerUser = async function (user) {
  const finalUser = {};

  finalUser.username = user.username;
  finalUser.email = user.email;
  return finalUser;
};

const signinUser = async function (user, token) {
  const finalUser = {};

  finalUser.id = user.id;
  finalUser.username = user.username;
  finalUser.email = user.email;
  finalUser.token = token;
  return finalUser;
};

module.exports = {
  registerUser,
  signinUser
};
