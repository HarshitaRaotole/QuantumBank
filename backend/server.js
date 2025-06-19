// This is an example for a Node.js Express backend.
// Your file name and structure might differ.

import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"

// Load environment variables from .env file
// In Vercel, environment variables are directly injected, so dotenv.config() might not be strictly needed
// but it's harmless if you also use a local .env file for development.
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001 // Or whatever port your backend uses

// Middleware to parse JSON bodies
app.use(express.json())

// --- START CORS CONFIGURATION ---
// Configure CORS to allow requests from your Vercel frontend domain
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
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies to be sent with requests (if your auth uses them)
    optionsSuccessStatus: 204, // For preflight requests
  }),
)
// --- END CORS CONFIGURATION ---

// Add logging middleware to see all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Import and register your routes here
import authRoutes from "./routes/authRoutes.js"
import accountRoutes from "./routes/accountRoutes.js"
import dashboardRoute from "./routes/dashboardRoute.js"
import transferRoutes from "./routes/transferRoute.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"

app.use("/api/auth", authRoutes)
app.use("/api/accounts", accountRoutes)
app.use("/api/dashboard", dashboardRoute)
app.use("/api/transfers", transferRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/notifications", notificationRoutes)

// Test route to verify server is working
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" })
})

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
    const client = await mongoose.connect(process.env.MONGO_URI, {
      // Adding explicit timeouts for better debugging
      serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      connectTimeoutMS: 30000, // Give up initial connection after 30 seconds
    })
    cachedDb = client
    console.log("MongoDB connected successfully")
    return cachedDb
  } catch (err) {
    console.error("MongoDB connection error:", err)
    throw err // Re-throw the error to be caught by the serverless function handler
  }
}

// Connect to MongoDB once when the function is initialized
// Vercel will call this function on cold starts
connectToDatabase().catch((err) => {
  console.error("Failed to connect to MongoDB on function initialization:", err)
  // Depending on your error handling, you might want to exit or just log
})

// --- NEW: Mongoose connection event listeners for more detailed logging ---
mongoose.connection.on("connected", () => {
  console.log("Mongoose default connection open to " + mongoose.connection.host)
})

mongoose.connection.on("error", (err) => {
  console.error("Mongoose default connection error: " + err)
})

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose default connection disconnected")
})
// --- END NEW ---

// Example login route (assuming your backend has one)
app.post("/api/auth/login", (req, res) => {
  // Your login logic here
  console.log("Login attempt:", req.body)
  // This is a placeholder. Your actual authController.js will handle this.
  if (req.body.email === "test@example.com" && req.body.password === "password") {
    res.status(200).json({ message: "Login successful!", token: "some-jwt-token" })
  } else {
    res.status(401).json({ message: "Invalid credentials" })
  }
})

// Add other backend routes here...

app.get("/", (req, res) => {
  res.send("Backend is running!")
})

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`)
})
