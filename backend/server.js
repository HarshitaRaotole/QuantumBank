const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the CORS package
const authRoutes = require('./routes/authRoutes'); // Import the auth routes

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // This is the port your Next.js frontend is running on
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Middlewares
app.use(express.json()); // To parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes); // Use the auth routes for /api/auth

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
