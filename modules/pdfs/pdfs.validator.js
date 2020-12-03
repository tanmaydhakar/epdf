const path = require('path');
const { body, validationResult, param } = require('express-validator');

const db = require(path.resolve('./models'));
const { Pdf } = db;
const accessTypeEnum = ['Public', 'Private'];

const createRules = [
  body('title')
    .exists()
    .withMessage('title does not exists')
    .isString()
    .withMessage('title must be string')
    .trim()
    .isLength({
      min: 5
    })
    .withMessage('title should be minimum 5 characters')
    .custom(value => {
      const field = {
        title: value
      };

      return Pdf.findBySpecificField(field).then(pdf => {
        if (pdf) {
          return Promise.reject(new Error('title already exists'));
        }
        return true;
      });
    }),

  body('pdf_url')
    .exists()
    .withMessage('pdf_url does not exists')
    .isString()
    .withMessage('pdf_url must be string')
    .custom(value => {
      const field = {
        pdf_url: value
      };

      return Pdf.findBySpecificField(field).then(pdf => {
        if (pdf) {
          return Promise.reject(new Error('pdf_url already exists'));
        }
        return true;
      });
    }),

  body('author')
    .exists()
    .withMessage('author does not exists')
    .isString()
    .withMessage('author must be string')
    .trim()
    .isLength({
      min: 1
    })
    .withMessage('author should be minimum 1 characters'),

  body('short_description')
    .exists()
    .withMessage('short_description does not exists')
    .isString()
    .withMessage('short_description must be string')
    .trim()
    .isLength({
      min: 50
    })
    .withMessage('short_description should be minimum 50 characters'),

  body('access_type')
    .exists()
    .withMessage('access_type does not exists')
    .isString()
    .withMessage('access_type must be string')
    .trim()
    .custom(value => {
      if (!accessTypeEnum.includes(value)) {
        return Promise.reject(new Error('invalid access_type'));
      }
      return true;
    })
];

const updateRules = [
  param('pdfId').custom(async (value, { req }) => {
    const pdf = await Pdf.findByPk(value);
    if (!pdf) {
      return Promise.reject(new Error('invalid pdfId'));
    }
    if (pdf.user_id !== req.user.id && !req.user.roles.includes('Admin')) {
      return Promise.reject(new Error('You dont have permission to access this resource'));
    }
    return true;
  }),
  body('title')
    .exists()
    .withMessage('title does not exists')
    .isString()
    .withMessage('title must be string')
    .trim()
    .isLength({
      min: 5
    })
    .withMessage('title should be minimum 5 characters')
    .custom((value, { req }) => {
      const field = {
        title: value
      };

      return Pdf.findBySpecificField(field).then(pdf => {
        if (pdf && req.params.pdfId !== pdf.id) {
          return Promise.reject(new Error('title already exists'));
        }
        return true;
      });
    }),

  body('pdf_url')
    .exists()
    .withMessage('pdf_url does not exists')
    .isString()
    .withMessage('pdf_url must be string')
    .custom((value, { req }) => {
      const field = {
        pdf_url: value
      };

      return Pdf.findBySpecificField(field).then(pdf => {
        if (pdf && req.params.pdfId !== pdf.id) {
          return Promise.reject(new Error('pdf_url already exists'));
        }
        return true;
      });
    }),

  body('author')
    .exists()
    .withMessage('author does not exists')
    .isString()
    .withMessage('author must be string')
    .trim()
    .isLength({
      min: 1
    })
    .withMessage('author should be minimum 1 characters'),

  body('short_description')
    .exists()
    .withMessage('short_description does not exists')
    .isString()
    .withMessage('short_description must be string')
    .trim()
    .isLength({
      min: 50
    })
    .withMessage('short_description should be minimum 50 characters'),

  body('access_type')
    .exists()
    .withMessage('access_type does not exists')
    .isString()
    .withMessage('access_type must be string')
    .trim()
    .custom(value => {
      if (!accessTypeEnum.includes(value)) {
        return Promise.reject(new Error('invalid access_type'));
      }
      return true;
    })
];

const showRules = [
  param('pdfId').custom(async (value, { req }) => {
    const pdf = await Pdf.findByPk(value);
    if (!pdf) {
      return Promise.reject(new Error('invalid pdfId'));
    }
    if (
      pdf.access_type !== 'Public' &&
      pdf.user_id !== req.user.id &&
      !pdf.user.roles.includes('Admin')
    ) {
      return Promise.reject(new Error('You dont have permission to access this resource'));
    }
    return true;
  })
];

const destroyRules = [
  param('pdfId').custom(async (value, { req }) => {
    const pdf = await Pdf.findByPk(value);
    if (!pdf) {
      return Promise.reject(new Error('invalid pdfId'));
    }
    if (pdf.user_id !== req.user.id && !req.user.roles.includes('Admin')) {
      return Promise.reject(new Error('You dont have permission to access this resource'));
    }
    return true;
  })
];

const verifyRules = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array().shift();
    if (error.msg === 'You dont have permission to access this resource') {
      return res.status(403).json({ message: error });
    }
    return res.status(422).json({ message: error });
  }
  return next();
};

module.exports = {
  verifyRules,
  createRules,
  updateRules,
  showRules,
  destroyRules
};
