const express = require("express")
const mysql = require("mysql2/promise")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const nodemailer = require("nodemailer")
const cron = require("node-cron")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "edumateai",
}

let db

async function initDatabase() {
  try {
    db = await mysql.createConnection(dbConfig)
    console.log("Connected to MySQL database")

    // Create tables if they don't exist
    await createTables()
  } catch (error) {
    console.error("Database connection failed:", error)
    process.exit(1)
  }
}

async function createTables() {
  try {
    // Users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Subjects table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS subjects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        color VARCHAR(7) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Assignments table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        subject_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date DATE NOT NULL,
        status ENUM('pending', 'in_progress', 'submitted') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
      )
    `)

    console.log("Database tables created successfully")
  } catch (error) {
    console.error("Error creating tables:", error)
  }
}

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Access token required" })
  }

  jwt.verify(token, process.env.JWT_SECRET || "your-secret-key", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" })
    }
    req.user = user
    next()
  })
}

// Email configuration
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const [existingUsers] = await db.execute("SELECT id FROM users WHERE email = ?", [email])

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const [result] = await db.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hashedPassword,
    ])

    // Generate JWT token
    const token = jwt.sign({ userId: result.insertId, email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { id: result.insertId, name, email },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const [users] = await db.execute("SELECT id, name, email, password FROM users WHERE email = ?", [email])

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const user = users[0]

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const [users] = await db.execute("SELECT id, name, email FROM users WHERE id = ?", [req.user.userId])

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ user: users[0] })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Subject Routes
app.get("/api/subjects", authenticateToken, async (req, res) => {
  try {
    const [subjects] = await db.execute(
      `
      SELECT s.*, COUNT(a.id) as assignment_count
      FROM subjects s
      LEFT JOIN assignments a ON s.id = a.subject_id
      WHERE s.user_id = ?
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `,
      [req.user.userId],
    )

    res.json(subjects)
  } catch (error) {
    console.error("Get subjects error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/subjects", authenticateToken, async (req, res) => {
  try {
    const { name, color } = req.body

    const [result] = await db.execute("INSERT INTO subjects (user_id, name, color) VALUES (?, ?, ?)", [
      req.user.userId,
      name,
      color,
    ])

    res.status(201).json({
      message: "Subject created successfully",
      subject: { id: result.insertId, name, color },
    })
  } catch (error) {
    console.error("Create subject error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.put("/api/subjects/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { name, color } = req.body

    await db.execute("UPDATE subjects SET name = ?, color = ? WHERE id = ? AND user_id = ?", [
      name,
      color,
      id,
      req.user.userId,
    ])

    res.json({ message: "Subject updated successfully" })
  } catch (error) {
    console.error("Update subject error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.delete("/api/subjects/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    await db.execute("DELETE FROM subjects WHERE id = ? AND user_id = ?", [id, req.user.userId])

    res.json({ message: "Subject deleted successfully" })
  } catch (error) {
    console.error("Delete subject error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Assignment Routes
app.get("/api/assignments", authenticateToken, async (req, res) => {
  try {
    const [assignments] = await db.execute(
      `
      SELECT a.*, s.name as subject_name, s.color as subject_color
      FROM assignments a
      JOIN subjects s ON a.subject_id = s.id
      WHERE a.user_id = ?
      ORDER BY a.due_date ASC
    `,
      [req.user.userId],
    )

    res.json(assignments)
  } catch (error) {
    console.error("Get assignments error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/assignments/stats", authenticateToken, async (req, res) => {
  try {
    const [stats] = await db.execute(
      `
      SELECT 
        COUNT(*) as totalAssignments,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingAssignments,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as inProgressAssignments,
        SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) as submittedAssignments,
        SUM(CASE WHEN status != 'submitted' AND due_date < CURDATE() THEN 1 ELSE 0 END) as overdueAssignments
      FROM assignments
      WHERE user_id = ?
    `,
      [req.user.userId],
    )

    res.json(stats[0])
  } catch (error) {
    console.error("Get assignment stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/assignments", authenticateToken, async (req, res) => {
  try {
    const { title, description, due_date, subject_id, status } = req.body

    const [result] = await db.execute(
      "INSERT INTO assignments (user_id, subject_id, title, description, due_date, status) VALUES (?, ?, ?, ?, ?, ?)",
      [req.user.userId, subject_id, title, description, due_date, status],
    )

    res.status(201).json({
      message: "Assignment created successfully",
      assignment: { id: result.insertId, title, description, due_date, subject_id, status },
    })
  } catch (error) {
    console.error("Create assignment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.put("/api/assignments/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, due_date, subject_id, status } = req.body

    await db.execute(
      "UPDATE assignments SET title = ?, description = ?, due_date = ?, subject_id = ?, status = ? WHERE id = ? AND user_id = ?",
      [title, description, due_date, subject_id, status, id, req.user.userId],
    )

    res.json({ message: "Assignment updated successfully" })
  } catch (error) {
    console.error("Update assignment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.delete("/api/assignments/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    await db.execute("DELETE FROM assignments WHERE id = ? AND user_id = ?", [id, req.user.userId])

    res.json({ message: "Assignment deleted successfully" })
  } catch (error) {
    console.error("Delete assignment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Email reminder function
async function sendEmailReminders() {
  try {
    const [assignments] = await db.execute(`
      SELECT a.*, u.name as user_name, u.email as user_email, s.name as subject_name
      FROM assignments a
      JOIN users u ON a.user_id = u.id
      JOIN subjects s ON a.subject_id = s.id
      WHERE a.status != 'submitted' 
      AND a.due_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
    `)

    for (const assignment of assignments) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: assignment.user_email,
        subject: `Reminder: ${assignment.title} is due tomorrow`,
        html: `
          <h2>Assignment Reminder</h2>
          <p>Hi ${assignment.user_name},</p>
          <p>This is a friendly reminder that your assignment <strong>"${assignment.title}"</strong> for ${assignment.subject_name} is due tomorrow.</p>
          <p><strong>Due Date:</strong> ${new Date(assignment.due_date).toLocaleDateString()}</p>
          <p><strong>Description:</strong> ${assignment.description || "No description provided"}</p>
          <p>Don't forget to complete and submit it on time!</p>
          <br>
          <p>Best regards,<br>EduMateAI Team</p>
        `,
      }

      await transporter.sendMail(mailOptions)
      console.log(`Reminder email sent to ${assignment.user_email} for assignment: ${assignment.title}`)
    }
  } catch (error) {
    console.error("Error sending email reminders:", error)
  }
}

// Schedule email reminders to run daily at 9 AM
cron.schedule("0 9 * * *", () => {
  console.log("Running daily email reminder check...")
  sendEmailReminders()
})

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
