const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Geçersiz ID formatı';
    error = {
      message,
      statusCode: 400
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    let message = 'Bu kayıt zaten mevcut';
    
    // Extract field name from error
    const field = Object.keys(err.keyValue)[0];
    if (field === 'username') {
      message = 'Bu kullanıcı adı zaten kullanılıyor';
    } else if (field === 'name') {
      message = 'Bu isim zaten kullanılıyor';
    }
    
    error = {
      message,
      statusCode: 400
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message,
      statusCode: 400
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Geçersiz token';
    error = {
      message,
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token süresi dolmuş';
    error = {
      message,
      statusCode: 401
    };
  }

  // Rate limit error
  if (err.statusCode === 429) {
    const message = 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin';
    error = {
      message,
      statusCode: 429
    };
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'Dosya boyutu çok büyük';
    error = {
      message,
      statusCode: 400
    };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Beklenmeyen dosya türü';
    error = {
      message,
      statusCode: 400
    };
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Sunucu hatası';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  });
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Endpoint bulunamadı - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  asyncHandler,
  notFound
};
