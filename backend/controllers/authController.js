const bcrypt = require('bcryptjs');  // For password hashing and comparison
const jwt = require('jsonwebtoken'); // For generating JWT tokens
const User = require('../models/User'); // Import your User model

// Signup handler
const signup = async (req, res) => {
  try {
    const { username, firstName, lastName, email, password } = req.body;

    // Check if the user already exists by username or email
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success
    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// Login handler
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token (optional)
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret_key', { expiresIn: '1h' });

    // Respond with a success message, the token, and the user data (including username)
    res.status(200).json({
      message: 'Login successful',
      token,  // You can store this token in localStorage on the client-side
      username: user.username,  // Return the username along with other user details
      firstName: user.firstName,  // Include other relevant user details
      lastName: user.lastName,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// Export the signup and login functions to make them available for other files
module.exports = { signup, login };
