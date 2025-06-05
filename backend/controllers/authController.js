const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as needed

// Helper function to create a new user
async function createNewUser(password, username, firstName, lastName, email) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return new User({
    username,
    firstName,
    lastName,
    email,
    password: hashedPassword
  });
}

// Signup handler
const signup = async (req, res) => {
  try {
    const { username, firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    const newUser = await createNewUser(password, username, firstName, lastName, email);
    await newUser.save();

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

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.firstName,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// Get current user handler
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username firstName lastName email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      totalBalance: 5000,
      accounts: [
        { id: 1, name: 'Checking Account', balance: 3000, number: '1234' },
        { id: 2, name: 'Savings Account', balance: 2000, number: '5678' }
      ],
      _recentTransactions: [
        {
          id: 1,
          description: 'Coffee',
          amount: -4.5,
          date: '2025-06-01',
          type: 'expense'
        },
        {
          id: 2,
          description: 'Salary',
          amount: 3500,
          date: '2025-05-30',
          type: 'income'
        }
      ],
      get recentTransactions() {
        return this._recentTransactions;
      },
      set recentTransactions(value) {
        this._recentTransactions = value;
      },
      insights: [
        { category: 'Food', amount: 150, percentage: 30 },
        { category: 'Rent', amount: 350, percentage: 70 }
      ]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export all handlers
module.exports = {
  signup,
  login,
  getCurrentUser
};
