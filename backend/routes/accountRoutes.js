import express from 'express';
import { addAccount, getAccounts } from '../controllers/accountController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Use Controllers for Clean Code
router.post('/', authenticateToken, addAccount);
router.get('/', authenticateToken, getAccounts);

export default router;
