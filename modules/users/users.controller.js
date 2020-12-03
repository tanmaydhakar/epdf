const path = require('path');
const bcrypt = require('bcrypt');

const db = require(path.resolve('./models'));
const serializer = require(path.resolve('./modules/users/users.serializer'));
const errorHandler = require(path.resolve('./utilities/errorHandler'));
const auth = require(path.resolve('./utilities/auth'));
const { User } = db;

const register = async function (req, res) {
  try {
    const user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    await user.save({ role: req.body.role });

    const responseData = await serializer.registerUser(user);
    return res.status(200).json({ user: responseData });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

const signin = async function (req, res) {
  try {
    const field = {
      username: req.body.username
    };
    const user = await User.findBySpecificField(field);
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      err.statusCode = 400;
      err.message = 'Invalid username or password';
      throw err;
    }
    const token = await auth.generateToken(user);

    const responseData = await serializer.signinUser(user, token);
    return res.status(200).json({ user: responseData });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

const destroy = async function (req, res) {
  try {
    const user = await User.findByPk(req.params.userId);
    await user.destroy();

    return res.status(200).json({ status: 'user has been deleted successfully' });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

module.exports = {
  register,
  signin,
  destroy
};
