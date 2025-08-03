const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({
      success: false,
      message: 'Doğrulama hatası',
      errors: errorMessages
    });
  }
  
  next();
};

// Product validation rules
const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Ürün adı gereklidir')
    .isLength({ max: 100 })
    .withMessage('Ürün adı 100 karakterden fazla olamaz'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Ürün açıklaması gereklidir')
    .isLength({ max: 1000 })
    .withMessage('Açıklama 1000 karakterden fazla olamaz'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Kategori gereklidir'),
  
  body('material')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Malzeme bilgisi 200 karakterden fazla olamaz'),
  
  body('dimensions')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Boyut bilgisi 100 karakterden fazla olamaz'),
  
  body('colors')
    .optional()
    .isArray()
    .withMessage('Renkler dizi formatında olmalıdır'),
  
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Öne çıkarılmış alanı boolean olmalıdır'),
  
  handleValidationErrors
];

// Category validation rules
const validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Kategori adı gereklidir')
    .isLength({ max: 50 })
    .withMessage('Kategori adı 50 karakterden fazla olamaz'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Açıklama 500 karakterden fazla olamaz'),
  
  body('icon')
    .optional()
    .trim(),
  
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sıralama numarası pozitif bir sayı olmalıdır'),
  
  handleValidationErrors
];

// Message validation rules
const validateMessage = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Ad soyad gereklidir')
    .isLength({ max: 100 })
    .withMessage('Ad soyad 100 karakterden fazla olamaz'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('E-posta adresi gereklidir')
    .isEmail()
    .withMessage('Geçerli bir e-posta adresi giriniz')
    .normalizeEmail(),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Mesaj gereklidir')
    .isLength({ max: 2000 })
    .withMessage('Mesaj 2000 karakterden fazla olamaz'),
  
  handleValidationErrors
];

// Admin login validation rules
const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Kullanıcı adı gereklidir')
    .isLength({ min: 3, max: 50 })
    .withMessage('Kullanıcı adı 3-50 karakter arasında olmalıdır'),

  body('password')
    .notEmpty()
    .withMessage('Şifre gereklidir')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır'),

  handleValidationErrors
];

// Admin creation validation rules
const validateAdmin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Kullanıcı adı gereklidir')
    .isLength({ min: 3, max: 50 })
    .withMessage('Kullanıcı adı 3-50 karakter arasında olmalıdır'),

  body('password')
    .notEmpty()
    .withMessage('Şifre gereklidir')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır'),

  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Ad 100 karakterden fazla olamaz'),

  body('role')
    .optional()
    .isIn(['admin', 'super_admin'])
    .withMessage('Geçersiz rol'),

  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isMongoId()
    .withMessage('Geçersiz ID formatı'),
  
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Sayfa numarası pozitif bir sayı olmalıdır'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit 1-100 arasında olmalıdır'),
  
  handleValidationErrors
];

module.exports = {
  validateProduct,
  validateCategory,
  validateMessage,
  validateLogin,
  validateAdmin,
  validateId,
  validatePagination,
  handleValidationErrors
};
