const express = require('express'); 
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');  // Import middleware

const { signup, login } = require('../controllers/authController');

// Signup and Login routes
router.post('/signup', signup);
router.post('/login', login);

// Protected route to get current user info
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    name: req.user.name,
    email: req.user.email,
    totalBalance: 5000,
    accounts: [
      { id: 1, name: "Checking Account", balance: 3000, number: "1234" },
      { id: 2, name: "Savings Account", balance: 2000, number: "5678" }
    ],
    recentTransactions: [
      { id: 1, description: "Coffee", amount: -4.5, date: "2025-06-01", type: "expense" },
      { id: 2, description: "Salary", amount: 3500, date: "2025-05-30", type: "income" }
    ],
    insights: [
      { category: "Food", amount: 150, percentage: 30 },
      { category: "Rent", amount: 350, percentage: 70 }
    ]
  });
});

module.exports = router;
