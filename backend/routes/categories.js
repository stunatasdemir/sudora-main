const express = require('express');
const router = express.Router();

const {
  getCategories,
  getCategory,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleActive,
  reorderCategories
} = require('../controllers/categoryController');

const { verifyJWT, optionalAuth } = require('../middleware/auth');
const { validateCategory, validateId } = require('../middleware/validation');
const { apiLimiter, adminLimiter } = require('../middleware/rateLimiter');

// Public routes
router.get('/', apiLimiter, optionalAuth, getCategories);
router.get('/slug/:slug', apiLimiter, getCategoryBySlug);
router.get('/:id', apiLimiter, validateId, getCategory);

// Protected routes (Admin only)
router.use(verifyJWT); // All routes below require authentication
router.use(adminLimiter); // Apply admin rate limiting

router.post('/', validateCategory, createCategory);
router.put('/:id', validateId, validateCategory, updateCategory);
router.delete('/:id', validateId, deleteCategory);
router.patch('/:id/toggle', validateId, toggleActive);
router.patch('/reorder', reorderCategories);

module.exports = router;
