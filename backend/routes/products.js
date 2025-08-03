const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleFeatured,
  getFeaturedProducts,
  reorderProducts
} = require('../controllers/productController');

const { verifyJWT } = require('../middleware/auth');
const { validateProduct, validateId, validatePagination } = require('../middleware/validation');
const { apiLimiter, adminLimiter } = require('../middleware/rateLimiter');

// Public routes
router.get('/', apiLimiter, validatePagination, getProducts);
router.get('/featured', apiLimiter, getFeaturedProducts);
router.get('/:id', apiLimiter, validateId, getProduct);

// Protected routes (Admin only)
router.use(verifyJWT); // All routes below require authentication
router.use(adminLimiter); // Apply admin rate limiting

router.post('/', validateProduct, createProduct);
router.put('/:id', validateId, validateProduct, updateProduct);
router.delete('/:id', validateId, deleteProduct);
router.patch('/:id/featured', validateId, toggleFeatured);
router.patch('/reorder', reorderProducts);
router.patch('/reorder', reorderProducts);

module.exports = router;
