import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; // ✅ Must include `.js` extension
import accountRoutes from './routes/accountRoutes.js'; // ✅ Must include `.js`

dotenv.config();

const app = express();

// Enable CORS for frontend at localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Middleware to parse JSON
app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // Exit if DB connection fails
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});