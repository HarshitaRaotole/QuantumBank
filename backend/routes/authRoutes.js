const express = require('express');
const router = express.Router();

// Import the signup and login functions from the authController
const { signup, login } = require('../controllers/authController');

// Define the signup route
router.post('/signup', signup);  // POST request to /api/auth/signup will use the signup function

// Define the login route
router.post('/login', login);    // POST request to /api/auth/login will use the login function

module.exports = router;
