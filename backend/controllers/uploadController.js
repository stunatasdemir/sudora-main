const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { asyncHandler } = require('../middleware/errorHandler');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const prefix = file.mimetype.startsWith('video/') ? 'video-' : 'product-';
    cb(null, prefix + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type - allow both images and videos
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Sadece resim ve video dosyaları yüklenebilir'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit for videos and large files
  }
});

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private (Admin)
const uploadImage = asyncHandler(async (req, res) => {
  console.log('Upload request received');
  console.log('File:', req.file);
  console.log('User:', req.admin);

  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).json({
      success: false,
      message: 'Dosya yüklenmedi'
    });
  }

  // Generate URL for the uploaded file
  const imageUrl = `/uploads/${req.file.filename}`;
  console.log('Generated image URL:', imageUrl);

  res.json({
    success: true,
    message: 'Dosya başarıyla yüklendi',
    imageUrl: imageUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private (Admin)
const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Dosya yüklenmedi'
    });
  }

  // Generate URLs for uploaded files
  const imageUrls = req.files.map(file => ({
    imageUrl: `/uploads/${file.filename}`,
    filename: file.filename,
    originalName: file.originalname,
    size: file.size
  }));

  res.json({
    success: true,
    message: `${req.files.length} dosya başarıyla yüklendi`,
    images: imageUrls
  });
});

// @desc    Delete image
// @route   DELETE /api/upload/:filename
// @access  Private (Admin)
const deleteImage = asyncHandler(async (req, res) => {
  const { filename } = req.params;
  
  if (!filename) {
    return res.status(400).json({
      success: false,
      message: 'Dosya adı gereklidir'
    });
  }

  const filePath = path.join(uploadsDir, filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'Dosya bulunamadı'
    });
  }

  try {
    // Delete file
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      message: 'Dosya başarıyla silindi'
    });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Dosya silinirken hata oluştu'
    });
  }
});

// @desc    Get image
// @route   GET /uploads/:filename
// @access  Public
const getImage = asyncHandler(async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadsDir, filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'Dosya bulunamadı'
    });
  }

  // Send file
  res.sendFile(filePath);
});

// @desc    List all uploaded images
// @route   GET /api/upload/list
// @access  Private (Admin)
const listImages = asyncHandler(async (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });

    const images = imageFiles.map(filename => {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        imageUrl: `/uploads/${filename}`,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      };
    });

    // Sort by creation date (newest first)
    images.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: images,
      total: images.length
    });
  } catch (error) {
    console.error('List images error:', error);
    res.status(500).json({
      success: false,
      message: 'Dosyalar listelenirken hata oluştu'
    });
  }
});

module.exports = {
  upload,
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  getImage,
  listImages
};
