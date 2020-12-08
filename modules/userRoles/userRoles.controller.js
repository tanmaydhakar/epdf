const path = require('path');

const serializer = require(path.resolve('./modules/userRoles/userRoles.serializer'));
const db = require(path.resolve('./models'));
const { UserRole } = db;

const add = async function (req, res) {
  const userRole = await UserRole.addUserRole(req);

  const responseData = await serializer.userRole(userRole);
  return res.status(201).json({ userRole: responseData });
};

const destroy = async function (req, res) {
  await UserRole.destroyUserRole(req);

  return res.status(200).json({ status: 'user role has been deleted successfully' });
};

module.exports = {
  add,
  destroy
};
