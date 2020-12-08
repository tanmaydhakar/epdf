const path = require('path');

const serializer = require(path.resolve('./modules/pdfs/pdfs.serializer'));
const db = require(path.resolve('./models'));
const { Pdf } = db;

const create = async function (req, res) {
  const pdf = await Pdf.createPdf(req);
  const responseData = await serializer.pdf(pdf);

  return res.status(201).json({ pdf: responseData });
};

const index = async function (req, res) {
  const pdfs = await Pdf.index(req);
  const responseData = await serializer.indexPdfs(pdfs);

  return res.status(200).json({ pdfs: responseData, total: pdfs.count });
};

const show = async function (req, res) {
  const pdf = await Pdf.getPdf(req.params.pdfId);
  const responseData = await serializer.pdf(pdf);

  return res.status(200).json({ pdf: responseData });
};

const update = async function (req, res) {
  const pdf = await Pdf.updatePdf(req);
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
  show,
  update,
  destroy
};
