const path = require('path');

const serializer = require(path.resolve('./modules/roles/roles.serializer'));
const db = require(path.resolve('./models'));
const { Role } = db;

const index = async function (req, res) {
  const roles = await Role.getRoles(req);

  const responseData = await serializer.roles(roles);
  return res.status(200).json({ roles: responseData, total: roles.count });
};

module.exports = {
  index
};
