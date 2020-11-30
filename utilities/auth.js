const jwt = require('jsonwebtoken');

const verifyToken = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(404).json({ message: 'Authorization header not provided' });
  }
  const token = req.headers.authorization;

  return jwt.verify(token, process.env.secret, function (err, decoded) {
    if (err) {
      return res.status(401).json({ message: 'Failed to authorize token' });
    }
    req.user = decoded.id;
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
