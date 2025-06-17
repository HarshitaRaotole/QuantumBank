import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"

import authRoutes from "./routes/authRoutes.js"
import accountRoutes from "./routes/accountRoutes.js"
import dashboardRoute from "./routes/dashboardRoute.js"
import transferRoutes from "./routes/transferRoute.js" // Add this import

dotenv.config()

const app = express()

// Enable CORS for frontend at localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
)

// Middleware to parse JSON
app.use(express.json())

// Add logging middleware to see all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Register routes
app.use("/api/auth", authRoutes)
app.use("/api/accounts", accountRoutes)
app.use("/api/dashboard", dashboardRoute)
app.use("/api/transfers", transferRoutes) // Add this line

// Test route to verify server is working
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" })
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})