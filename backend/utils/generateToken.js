/**
 * JWT Generation Utility
 * Why it exists: Generates secure, short-to-medium lived web tokens for logged-in sessions.
 * What it does: Creates a signed JWT containing user ID, email, and security role.
 * How it connects: Triggered by user authentication / login controllers to share credentials.
 */

const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'fallback_default_jwt_secret',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    }
  );
};

module.exports = generateToken;
