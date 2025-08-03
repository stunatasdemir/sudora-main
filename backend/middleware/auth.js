const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const { Admin } = require('../models');

// Middleware to verify JWT token
const verifyJWT = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Erişim token\'ı gereklidir'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token türü'
      });
    }

    // Check if admin exists and is active
    const admin = await Admin.findById(decoded.adminId).select('-password -refreshTokens');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin kullanıcısı bulunamadı'
      });
    }

    if (!admin.active) {
      return res.status(401).json({
        success: false,
        message: 'Hesap devre dışı bırakılmış'
      });
    }

    if (admin.isLocked) {
      return res.status(401).json({
        success: false,
        message: 'Hesap geçici olarak kilitlenmiş'
      });
    }

    // Add admin info to request
    req.admin = admin;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token süresi dolmuş',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token',
        code: 'INVALID_TOKEN'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Token doğrulama hatası'
    });
  }
};

// Middleware to check admin role
const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gereklidir'
      });
    }

    if (roles.length > 0 && !roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bu işlem için yetkiniz bulunmuyor'
      });
    }

    next();
  };
};

// Middleware to check super admin role
const requireSuperAdmin = requireRole(['super_admin']);

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
      const decoded = verifyToken(token);
      const admin = await Admin.findById(decoded.adminId).select('-password -refreshTokens');
      
      if (admin && admin.active && !admin.isLocked) {
        req.admin = admin;
        req.token = token;
      }
    }
    
    next();
  } catch (error) {
    // Silently continue without auth
    next();
  }
};

module.exports = {
  verifyJWT,
  requireRole,
  requireSuperAdmin,
  optionalAuth
};
