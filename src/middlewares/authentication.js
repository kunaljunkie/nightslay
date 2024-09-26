const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token is not Availalble' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ message: 'Token expired, please log in again' });
      }
      return res.status(403).json({ message: 'Invalid token, please log in again' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
