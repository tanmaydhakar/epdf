const userRole = async function (userRoleData) {
  const finalUserRole = {};

  finalUserRole.id = userRoleData.id;

  finalUserRole.user = {};
  finalUserRole.user.id = userRoleData.user.id;
  finalUserRole.user.username = userRoleData.user.username;
  finalUserRole.user.email = userRoleData.user.email;

  finalUserRole.role = {};
  finalUserRole.role.id = userRoleData.role.id;
  finalUserRole.role.name = userRoleData.role.name;

  return finalUserRole;
};

module.exports = {
  userRole
};
