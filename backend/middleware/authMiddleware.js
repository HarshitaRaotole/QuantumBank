import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expected: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Attach user info to the request for use in protected routes
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
    };

    next();
  });
}

export default authenticateToken;
