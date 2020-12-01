const jwt = require('jsonwebtoken');
const path = require('path');

const db = require(path.resolve('./models'));
const { UserRole } = db;

const verifyToken = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(404).json({ message: 'Authorization header not provided' });
  }
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  return jwt.verify(token, process.env.secret, async function (err, decoded) {
    if (err) {
      return res.status(401).json({ message: 'Failed to authorize token' });
    }
    req.user = decoded;
    req.user.roles = [];

    const where = {
      user_id: decoded.id
    };

    const roles = await UserRole.findAll({
      where,
      include: [{ all: true, nested: true }]
    });
    if (roles.length) {
      roles.forEach(userRole => {
        req.user.roles.push(userRole.role.name);
      });
    }
    return next();
  });
};

const generateToken = async function (user) {
  const jwtOption = {
    id: user.id,
    username: user.username,
    email: user.email
  };
  return jwt.sign(jwtOption, process.env.secret, {
    expiresIn: 86400
  });
};

module.exports = {
  verifyToken,
  generateToken
};
