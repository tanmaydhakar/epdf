const pdfCategories = async function (pdfCategories) {
  const finalPdfCategoriesData = [];

  for (let i = 0; i < pdfCategories.length; i += 1) {
    const pdfcategoryData = {};
    const pdfcategory = pdfCategories[i];

    pdfcategoryData.id = pdfcategory.id;
    pdfcategoryData.pdf = pdfcategory.pdf;
    pdfcategoryData.category = pdfcategory.category;

    finalPdfCategoriesData.push(pdfcategoryData);
  }

  return finalPdfCategoriesData;
};

module.exports = {
  pdfCategories
};
