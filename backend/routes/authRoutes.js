import express from 'express';
const router = express.Router();

import authenticateToken from '../middleware/authMiddleware.js';
import { signup, login, getCurrentUser } from '../controllers/authController.js';

// Signup and Login routes
router.post('/signup', signup);
router.post('/login', login);

// Get current user info (real user from DB)
router.get('/me', authenticateToken, getCurrentUser);

export default router;
