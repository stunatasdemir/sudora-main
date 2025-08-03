const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '24h';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';

// Generate access token
const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
    issuer: 'sudora-api',
    audience: 'sudora-admin'
  });
};

// Generate refresh token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRE,
    issuer: 'sudora-api',
    audience: 'sudora-admin'
  });
};

// Verify token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'sudora-api',
      audience: 'sudora-admin'
    });
  } catch (error) {
    throw error;
  }
};

// Decode token without verification (for expired token info)
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

// Generate token pair (access + refresh)
const generateTokenPair = (adminId, username, role = 'admin') => {
  const payload = {
    adminId,
    username,
    role,
    type: 'access'
  };

  const refreshPayload = {
    adminId,
    username,
    role,
    type: 'refresh'
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(refreshPayload),
    expiresIn: JWT_EXPIRE
  };
};

// Extract token from Authorization header
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1];
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  generateTokenPair,
  extractTokenFromHeader
};
