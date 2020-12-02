const path = require('path');

const errorHandler = require(path.resolve('./utilities/errorHandler'));
const serializer = require(path.resolve('./modules/pdfCategories/pdfCategories.serializer'));
const db = require(path.resolve('./models'));
const { PdfCategory } = db;

const list = async function (req, res) {
  try {
    const pdfCategories = await PdfCategory.getPdfCategories(req.body.pdfId);

    const responseData = await serializer.pdfCategories(pdfCategories);
    return res.status(201).json({ pdfPreviews: responseData });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

const create = async function (req, res) {
  try {
    const pdfCategories = await PdfCategory.createPdfCategories(req);

    const responseData = await serializer.pdfCategories(pdfCategories);
    return res.status(201).json({ pdfPreviews: responseData });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

const update = async function (req, res) {
  try {
    const pdfCategories = await PdfCategory.updatePdfCategories(req);

    const responseData = await serializer.pdfCategories(pdfCategories);
    return res.status(201).json({ pdfPreviews: responseData });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

module.exports = {
  list,
  create,
  update
};