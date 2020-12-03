const pdfPreviews = function (pdfPreviews) {
  const finalPdfPreviewData = [];

  for (let i = 0; i < pdfPreviews.length; i += 1) {
    const pdfPreviewData = {};
    const pdfPreview = pdfPreviews[i];
    pdfPreviewData.id = pdfPreview.id;
    pdfPreviewData.image_url = pdfPreview.image_url;
    pdfPreviewData.id = pdfPreview.id;
    pdfPreviewData.pdf = pdfPreview.pdf;

    finalPdfPreviewData.push(pdfPreviewData);
  }

  return finalPdfPreviewData;
};

module.exports = {
  pdfPreviews
};
