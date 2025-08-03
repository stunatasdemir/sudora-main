const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Çok fazla istek gönderildi, 15 dakika sonra tekrar deneyin'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Çok fazla giriş denemesi, 15 dakika sonra tekrar deneyin'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Contact form rate limiter
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 contact form submissions per hour
  message: {
    success: false,
    message: 'Saatte en fazla 3 mesaj gönderebilirsiniz'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin operations rate limiter
const adminLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 admin requests per minute
  message: {
    success: false,
    message: 'Çok fazla admin işlemi, 1 dakika sonra tekrar deneyin'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  contactLimiter,
  adminLimiter
};
