const path = require('path');

const serializer = require(path.resolve('./modules/pdfCategories/pdfCategories.serializer'));
const db = require(path.resolve('./models'));
const { PdfCategory } = db;

const show = async function (req, res) {
  const pdfCategories = await PdfCategory.getPdfCategories(req.params.pdfId);

  const responseData = await serializer.pdfCategories(pdfCategories);
  return res.status(200).json({ pdfCategories: responseData });
};

module.exports = {
  show
};
