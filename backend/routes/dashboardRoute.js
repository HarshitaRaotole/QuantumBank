import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔒 Protected dashboard route
router.get('/', authenticateToken, (req, res) => {
  res.json({
    message: `Welcome, ${req.user.username}`,
    user: req.user,
  });
});

export default router;
