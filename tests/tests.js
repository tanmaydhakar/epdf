const path = require('path');

require(path.resolve('./index'));
const utilitiesTests = require(path.resolve('./tests/utilitiesTests'));
const userTests = require(path.resolve('./tests/usersTests'));
const userRolesTests = require(path.resolve('./tests/userRolesTests'));
const rolesTests = require(path.resolve('./tests/rolesTests'));
const pdfTests = require(path.resolve('./tests/pdfTests'));
const userProfileTests = require(path.resolve('./tests/userProfileTests'));
const pdfPreviewsTests = require(path.resolve('./tests/pdfPreviewsTests'));
const pdfCategoriesTests = require(path.resolve('./tests/pdfCategoriesTests'));
const categoriesTests = require(path.resolve('./tests/categoriesTests'));

utilitiesTests();
userTests();
userRolesTests();
rolesTests();
pdfTests();
userProfileTests();
pdfPreviewsTests();
pdfCategoriesTests();
categoriesTests();
