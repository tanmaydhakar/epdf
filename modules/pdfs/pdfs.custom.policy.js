const path = require('path');

const errorHandler = require(path.resolve('./utilities/errorHandler'));
const db = require(path.resolve('./models'));
const { Pdf } = db;
const err = new Error();

const pdfAccessValidator = async function (req, res, next) {
  try {
    if (req.user.roles.includes('Admin')) {
      return next();
    }
    const pdfId = req.params.pdfId ? req.params.pdfId : req.body.pdfId;

    const pdf = await Pdf.findByPk(pdfId);
    if (pdf.user_id !== req.user.id) {
      err.statusCode = 403;
      err.message = 'you dont have permission to update this pdf';
      throw err;
    }
    return next();
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

module.exports = {
  pdfAccessValidator
};
