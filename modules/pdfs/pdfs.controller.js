const path = require('path');

const errorHandler = require(path.resolve('./utilities/errorHandler'));
const serializer = require(path.resolve('./modules/pdfs/pdfs.serializer'));
const db = require(path.resolve('./models'));
const { Pdf } = db;
const err = new Error();

const create = async function (req, res) {
  try {
    const pdf = await Pdf.createPdf(req);
    if (!pdf) {
      err.statusCode = 500;
      err.message = 'Error occured while creating creating pdf';
      throw err;
    }
    const responseData = await serializer.pdf(pdf);

    return res.status(201).json({ pdf: responseData });
  } catch (error) {
    const errorResponse = errorHandler.getErrorMessage(error);
    return res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
};

const index = async function (req, res) {
  const pdfs = await Pdf.index(req);
  const responseData = await serializer.indexPdfs(pdfs);

  return res.status(200).json({ pdfs: responseData });
};

const list = async function (req, res) {
  const pdf = await Pdf.findByPk(req.params.pdfId);
  const responseData = await serializer.pdf(pdf);

  return res.status(201).json({ pdf: responseData });
};

const update = async function (req, res) {
  const pdf = await Pdf.update(req);
  const responseData = await serializer.pdf(pdf);

  return res.status(200).json({ pdf: responseData });
};

const destroy = async function (req, res) {
  const pdf = await Pdf.findByPk(req.params.pdfId);
  await pdf.destroy();

  return res.status(200).json({ status: 'Pdf has been deleted successfully' });
};

module.exports = {
  create,
  index,
  list,
  update,
  destroy
};
