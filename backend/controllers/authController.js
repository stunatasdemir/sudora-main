const { Admin } = require('../models');
const { generateTokenPair, verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Find admin by username
  const admin = await Admin.findByUsername(username);

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Geçersiz kullanıcı adı veya şifre'
    });
  }
  
  // Check if account is locked
  if (admin.isLocked) {
    return res.status(423).json({
      success: false,
      message: 'Hesap geçici olarak kilitlenmiş. Lütfen daha sonra tekrar deneyin.'
    });
  }
  
  // Check password
  const isPasswordValid = await admin.comparePassword(password);
  
  if (!isPasswordValid) {
    // Increment login attempts
    await admin.incLoginAttempts();
    
    return res.status(401).json({
      success: false,
      message: 'Geçersiz kullanıcı adı veya şifre'
    });
  }
  
  // Reset login attempts on successful login
  await admin.resetLoginAttempts();
  
  // Generate tokens
  const tokens = generateTokenPair(admin._id, admin.username, admin.role);
  
  // Save refresh token to database
  admin.refreshTokens.push({
    token: tokens.refreshToken,
    createdAt: new Date()
  });
  
  // Keep only last 5 refresh tokens
  if (admin.refreshTokens.length > 5) {
    admin.refreshTokens = admin.refreshTokens.slice(-5);
  }
  
  await admin.save();
  
  res.json({
    success: true,
    message: 'Giriş başarılı',
    data: {
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
        lastLogin: admin.lastLogin
      },
      tokens
    }
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token gereklidir'
    });
  }
  
  try {
    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token türü'
      });
    }
    
    // Find admin and check if refresh token exists
    const admin = await Admin.findById(decoded.adminId);
    
    if (!admin || !admin.active) {
      return res.status(401).json({
        success: false,
        message: 'Admin kullanıcısı bulunamadı'
      });
    }
    
    const tokenExists = admin.refreshTokens.some(
      token => token.token === refreshToken
    );
    
    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz refresh token'
      });
    }
    
    // Generate new tokens
    const tokens = generateTokenPair(admin._id, admin.email, admin.role);
    
    // Replace old refresh token with new one
    admin.refreshTokens = admin.refreshTokens.filter(
      token => token.token !== refreshToken
    );
    admin.refreshTokens.push({
      token: tokens.refreshToken,
      createdAt: new Date()
    });
    
    await admin.save();
    
    res.json({
      success: true,
      message: 'Token yenilendi',
      data: { tokens }
    });
    
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Geçersiz refresh token'
    });
  }
});

// @desc    Admin logout
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  const token = extractTokenFromHeader(req.headers.authorization);
  const { refreshToken } = req.body;
  
  if (refreshToken) {
    // Remove refresh token from database
    await Admin.findByIdAndUpdate(req.admin._id, {
      $pull: { refreshTokens: { token: refreshToken } }
    });
  }
  
  res.json({
    success: true,
    message: 'Çıkış başarılı'
  });
});

// @desc    Logout from all devices
// @route   POST /api/auth/logout-all
// @access  Private
const logoutAll = asyncHandler(async (req, res) => {
  // Remove all refresh tokens
  await Admin.findByIdAndUpdate(req.admin._id, {
    $set: { refreshTokens: [] }
  });
  
  res.json({
    success: true,
    message: 'Tüm cihazlardan çıkış yapıldı'
  });
});

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select('-password -refreshTokens');
  
  res.json({
    success: true,
    data: admin
  });
});

// @desc    Update admin profile
// @route   PUT /api/auth/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, username } = req.body;

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (username !== undefined) updateData.username = username;

  const admin = await Admin.findByIdAndUpdate(
    req.admin._id,
    updateData,
    { new: true, runValidators: true }
  ).select('-password -refreshTokens');

  res.json({
    success: true,
    message: 'Profil güncellendi',
    data: admin
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  // Get admin with password
  const admin = await Admin.findById(req.admin._id);
  
  // Check current password
  const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
  
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Mevcut şifre yanlış'
    });
  }
  
  // Update password
  admin.password = newPassword;
  await admin.save();
  
  // Remove all refresh tokens to force re-login
  admin.refreshTokens = [];
  await admin.save();
  
  res.json({
    success: true,
    message: 'Şifre başarıyla değiştirildi. Lütfen tekrar giriş yapın.'
  });
});

// @desc    Verify token (for frontend)
// @route   GET /api/auth/verify
// @access  Private
const verifyTokenEndpoint = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Token geçerli',
    data: {
      admin: req.admin
    }
  });
});

module.exports = {
  login,
  refreshToken,
  logout,
  logoutAll,
  getMe,
  updateProfile,
  changePassword,
  verifyTokenEndpoint
};
