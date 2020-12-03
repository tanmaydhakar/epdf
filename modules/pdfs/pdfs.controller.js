const path = require('path');

const errorHandler = require(path.resolve('./utilities/errorHandler'));
const serializer = require(path.resolve('./modules/pdfs/pdfs.serializer'));
const db = require(path.resolve('./models'));
const { Pdf } = db;

const create = async function (req, res) {
  try {
    const pdf = await Pdf.createPdf(req);
    const responseData = await serializer.pdf(pdf);

    return res.status(201).json({ pdf: responseData });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

const index = async function (req, res) {
  try {
    const pdfs = await Pdf.index(req);
    const responseData = await serializer.indexPdfs(pdfs);

    return res.status(200).json({ pdfs: responseData });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

const show = async function (req, res) {
  try {
    const pdf = await Pdf.getPdf(req.params.pdfId);
    const responseData = await serializer.pdf(pdf);

    return res.status(201).json({ pdf: responseData });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

const update = async function (req, res) {
  try {
    const pdf = await Pdf.updatePdf(req);
    const responseData = await serializer.pdf(pdf);

    return res.status(200).json({ pdf: responseData });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

const destroy = async function (req, res) {
  try {
    const pdf = await Pdf.findByPk(req.params.pdfId);
    await pdf.destroy();

    return res.status(200).json({ status: 'Pdf has been deleted successfully' });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

module.exports = {
  create,
  index,
  show,
  update,
  destroy
};
