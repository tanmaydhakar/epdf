const path = require('path');

const errorHandler = require(path.resolve('./utilities/errorHandler'));
const serializer = require(path.resolve('./modules/pdfPreviews/pdfPreviews.serializer'));
const db = require(path.resolve('./models'));
const { PdfPreviews } = db;

const create = async function (req, res) {
  try {
    const pdfPreviewsData = await PdfPreviews.createPdfPreview(req);

    const responseData = await serializer.pdfPreviews(pdfPreviewsData);
    return res.status(201).json({ pdfPreviews: responseData });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

const update = async function (req, res) {
  try {
    const pdfPreviewsData = await PdfPreviews.updatePdfPreview(req);

    const responseData = await serializer.pdfPreviews(pdfPreviewsData);
    return res.status(201).json({ pdfPreviews: responseData });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

module.exports = {
  create,
  update
};
