const express = require('express');
const router = express.Router();

const {
  login,
  refreshToken,
  logout,
  logoutAll,
  getMe,
  updateProfile,
  changePassword,
  verifyTokenEndpoint
} = require('../controllers/authController');

const { verifyJWT } = require('../middleware/auth');
const { validateLogin } = require('../middleware/validation');
const { authLimiter, adminLimiter } = require('../middleware/rateLimiter');
const { body } = require('express-validator');

// Public routes
router.post('/login', authLimiter, validateLogin, login);

router.post('/refresh', authLimiter, [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token gereklidir')
], refreshToken);

// Protected routes (Admin only)
router.use(verifyJWT); // All routes below require authentication
router.use(adminLimiter); // Apply admin rate limiting

router.get('/verify', verifyTokenEndpoint);
router.get('/me', getMe);

router.post('/logout', [
  body('refreshToken')
    .optional()
    .isString()
    .withMessage('Refresh token string olmalıdır')
], logout);

router.post('/logout-all', logoutAll);

router.put('/me', [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Ad 100 karakterden fazla olamaz'),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Kullanıcı adı 3-50 karakter arasında olmalıdır')
], updateProfile);

router.put('/change-password', [
  body('currentPassword')
    .notEmpty()
    .withMessage('Mevcut şifre gereklidir'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Yeni şifre en az 6 karakter olmalıdır')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('Yeni şifre mevcut şifreden farklı olmalıdır');
      }
      return true;
    })
], changePassword);

module.exports = router;
