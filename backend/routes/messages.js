const express = require('express');
const router = express.Router();

const {
  createMessage,
  getMessages,
  getMessage,
  markAsRead,
  markAsUnread,
  replyToMessage,
  updatePriority,
  deleteMessage,
  bulkOperations
} = require('../controllers/messageController');

const { verifyJWT } = require('../middleware/auth');
const { validateMessage, validateId, validatePagination } = require('../middleware/validation');
const { contactLimiter, adminLimiter } = require('../middleware/rateLimiter');
const { body } = require('express-validator');

// Public routes
router.post('/', contactLimiter, validateMessage, createMessage);

// Protected routes (Admin only)
router.use(verifyJWT); // All routes below require authentication
router.use(adminLimiter); // Apply admin rate limiting

router.get('/', validatePagination, getMessages);
router.get('/:id', validateId, getMessage);
router.patch('/:id/read', validateId, markAsRead);
router.patch('/:id/unread', validateId, markAsUnread);
router.delete('/:id', validateId, deleteMessage);

// Reply to message
router.post('/:id/reply', [
  validateId,
  body('replyMessage')
    .trim()
    .notEmpty()
    .withMessage('Yanıt mesajı gereklidir')
    .isLength({ max: 2000 })
    .withMessage('Yanıt mesajı 2000 karakterden fazla olamaz')
], replyToMessage);

// Update priority
router.patch('/:id/priority', [
  validateId,
  body('priority')
    .isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Geçersiz öncelik değeri')
], updatePriority);

// Bulk operations
router.post('/bulk', [
  body('action')
    .isIn(['markRead', 'markUnread', 'delete'])
    .withMessage('Geçersiz işlem'),
  body('messageIds')
    .isArray({ min: 1 })
    .withMessage('En az bir mesaj ID\'si gereklidir')
    .custom((value) => {
      if (!value.every(id => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/))) {
        throw new Error('Geçersiz mesaj ID formatı');
      }
      return true;
    })
], bulkOperations);

module.exports = router;
