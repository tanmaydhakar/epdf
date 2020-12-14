const path = require('path');

const serializer = require(path.resolve('./modules/pdfPreviews/pdfPreviews.serializer'));
const db = require(path.resolve('./models'));
const { PdfPreviews } = db;

const show = async function (req, res) {
  const pdfPreviewsData = await PdfPreviews.getPreviews(req.params.pdfId);

  const responseData = await serializer.pdfPreviews(pdfPreviewsData);
  return res.status(200).json({ pdfPreviews: responseData });
};

module.exports = {
  show
};
