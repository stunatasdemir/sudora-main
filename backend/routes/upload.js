const express = require('express');
const router = express.Router();

const {
  upload,
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  getImage,
  listImages
} = require('../controllers/uploadController');

const { verifyJWT } = require('../middleware/auth');
const { adminLimiter } = require('../middleware/rateLimiter');

// Public route for serving images
router.get('/:filename', getImage);

// Protected routes (Admin only)
router.use(verifyJWT); // All routes below require authentication
router.use(adminLimiter); // Apply admin rate limiting

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Dosya boyutu çok büyük. Maksimum 500MB yükleyebilirsiniz.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Çok fazla dosya. Maksimum 8 dosya yükleyebilirsiniz.'
      });
    }
    if (err.message === 'Sadece resim ve video dosyaları yüklenebilir') {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Dosya yükleme hatası: ' + err.message
    });
  }
  next();
};

// Single image upload
router.post('/', upload.single('image'), handleMulterError, uploadImage);

// Multiple image upload
router.post('/multiple', upload.array('images', 8), handleMulterError, uploadMultipleImages);

// Delete image
router.delete('/:filename', deleteImage);

// List all images
router.get('/list', listImages);

module.exports = router;
