import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to hash and create new user
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

// Signup
export const signup = async (req, res) => {
  try {
    const { username, firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    const newUser = await createNewUser(password, username, firstName, lastName, email);
    await newUser.save();

    res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Sign JWT with userId
    const token = jwt.sign(
      {
        userId: user._id, // ✅ consistent key
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('username firstName lastName email');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
