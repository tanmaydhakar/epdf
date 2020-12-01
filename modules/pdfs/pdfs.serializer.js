const pdf = function (pdf) {
  const finalPdfData = {};

  finalPdfData.id = pdf.id;
  finalPdfData.title = pdf.title;
  finalPdfData.pdf_url = pdf.pdf_url;
  finalPdfData.author = pdf.author;
  finalPdfData.short_description = pdf.short_description;
  finalPdfData.access_type = pdf.access_type;
  finalPdfData.user_id = pdf.user_id;

  return finalPdfData;
};

const indexPdfs = function (pdfs) {
  const finalPdfsData = [];

  for (i = 0; i <= pdfs.length - 1; i += 1) {
    const pdfData = {};
    const pdf = pdfs[i];
    pdfData.id = pdf.id;
    pdfData.title = pdf.title;
    pdfData.pdf_url = pdf.pdf_url;
    pdfData.author = pdf.author;
    pdfData.short_description = pdf.short_description;
    pdfData.access_type = pdf.access_type;
    pdfData.user_id = pdf.user_id;
    pdfData.previews = pdf.previews;
    pdfData.categories = pdf.categories;

    finalPdfsData.push(pdfData);
  }

  return finalPdfsData;
};

module.exports = {
  pdf,
  indexPdfs
};
