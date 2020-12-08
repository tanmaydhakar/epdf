const roles = async function (roles) {
  const finalRoles = [];

  for (let i = 0; i < roles.rows.length; i += 1) {
    const role = roles.rows[i];
    const roleData = {};

    roleData.id = role.id;
    roleData.name = role.name;

    finalRoles.push(roleData);
  }

  return finalRoles;
};

module.exports = {
  roles
};
