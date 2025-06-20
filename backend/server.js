import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001 // PORT is typically not used in Vercel serverless, but kept for local dev

app.use(express.json())

const allowedOrigins = ["http://localhost:3000", "https://quantum-bank-frontend1.vercel.app"].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`
        return callback(new Error(msg), false)
      }
      return callback(null, true)
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 204,
  }),
)

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Import and register your routes here
import authRoutes from "./routes/authRoutes.js"
import accountRoutes from "./routes/accountRoutes.js"
import dashboardRoute from "./routes/dashboardRoute.js"
import transferRoutes from "./routes/transferRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"

app.use("/api/auth", authRoutes)
app.use("/api/accounts", accountRoutes)
app.use("/api/dashboard", dashboardRoute)
app.use("/api/transfers", transferRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/notifications", notificationRoutes)

app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" })
})

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
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    })
    cachedDb = client
    console.log("MongoDB connected successfully")
    return cachedDb
  } catch (err) {
    console.error("MongoDB connection error:", err)
    throw err
  }
}

// ✅ MODIFIED: Call connectToDatabase directly. Mongoose will buffer operations until connected.
// This is the standard pattern for serverless functions.
connectToDatabase().catch((err) => {
  console.error("Failed to connect to MongoDB on function initialization:", err)
  // In a serverless environment, you might not want to process.exit(1) here
  // as it could prevent the function from ever starting. Logging is usually sufficient.
})

mongoose.connection.on("connected", () => {
  console.log("Mongoose default connection open to " + mongoose.connection.host)
})

mongoose.connection.on("error", (err) => {
  console.error("Mongoose default connection error: " + err)
})

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose default connection disconnected")
})

app.get("/", (req, res) => {
  res.send("Backend is running!")
})

// ✅ NEW: Export the app instance for Vercel to use
export default app
