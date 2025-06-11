import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // ✅ Extract all fields from the token
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
    };

    // 🐞 Debug logs for verification
    console.log("🔍 Authenticated User ID:", decoded.userId);
    console.log("🔍 Authenticated Username:", decoded.username);

    next();
  });
}

export default authenticateToken;
