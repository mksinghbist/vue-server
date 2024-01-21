const jwt = require('jsonwebtoken');

class JwtToken {
  constructor() {
    this.secretKey = 'manoj@ayush-ayansh-2021';
  }

  verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Token not provided.' });
    }

    jwt.verify(token, this.secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token.' });
      }
      req.user = decoded; // Attach user information to the request
      next();
    });
  };

  generateToken = (payload) => {
    const options = { expiresIn: '24h' }; // Token expiration time
    return jwt.sign(payload, this.secretKey, options);
  };
}

const jwtToken = new JwtToken();

module.exports = jwtToken;