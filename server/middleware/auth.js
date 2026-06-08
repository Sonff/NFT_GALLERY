const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from format: Bearer <token>
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey12345');

      // Attach decoded wallet info to request object
      req.user = {
        walletAddress: decoded.walletAddress.toLowerCase()
      };

      return next();
    } catch (error) {
      logger.warn(`Failed token verification: ${error.message}`);
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }
};

module.exports = { protect };
