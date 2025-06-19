import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"

// Load environment variables from .env file
// For Vercel, environment variables are set directly in the dashboard,
// so dotenv.config() is primarily for local development.
dotenv.config()

const app = express()

// Middleware to parse JSON bodies
app.use(express.json())

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000", // For local Next.js development
  process.env.FRONTEND_URL, // Your deployed Next.js frontend URL (set this in Vercel env vars)
].filter(Boolean) // Filter out undefined if FRONTEND_URL is not set

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`
        return callback(new Error(msg), false)
      }
      return callback(null, true)
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
)

// MongoDB Connection
let cachedDb = null

async function connectToDatabase() {
  if (cachedDb) {
    console.log("Using existing database connection")
    return cachedDb
  }

  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI environment variable is not set.")
    throw new Error("MONGO_URI is not set.")
  }

  try {
    console.log("Connecting to new database connection")
    const client = await mongoose.connect(process.env.MONGO_URI)
    cachedDb = client
    console.log("MongoDB connected successfully")
    return cachedDb
  } catch (err) {
    console.error("MongoDB connection error:", err)
    throw err // Re-throw the error to be caught by the serverless function handler
  }
}

// Add logging middleware to see all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Import and register your routes here
// IMPORTANT: Adjust these paths to be relative to backend/api/index.js
import authRoutes from "../routes/authRoutes.js"
import accountRoutes from "../routes/accountRoutes.js"
import dashboardRoute from "../routes/dashboardRoute.js"
import transferRoutes from "../routes/transferRoute.js"
import transactionRoutes from "../routes/transactionRoutes.js"
import notificationRoutes from "../routes/notificationRoutes.js"

app.use("/api/auth", authRoutes)
app.use("/api/accounts", accountRoutes)
app.use("/api/dashboard", dashboardRoute)
app.use("/api/transfers", transferRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/notifications", notificationRoutes)

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Quantum Bank Backend API!" })
})

// Test route to verify server is working
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" })
})

// Connect to MongoDB once when the function is initialized (cold start)
connectToDatabase().catch((err) => {
  console.error("Failed to connect to MongoDB on function initialization:", err)
  // Depending on your error handling, you might want to exit or just log
})

// For Vercel, you MUST export the app instance
export default app

// Start the server only if not in a Vercel serverless environment
// (i.e., when running locally with `nodemon` or `node api/index.js`)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}
