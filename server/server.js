const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const errorHandler = require("./middleware/errorHandler")
const { authLimiter, apiLimiter } = require("./middleware/rateLimiter")

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Rate limiting
app.use("/api/auth", authLimiter)
app.use("/api/cars", apiLimiter)
app.use("/api/inquiries", apiLimiter)
app.use("/api/images", apiLimiter)

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/cars", require("./routes/cars"))
app.use("/api/inquiries", require("./routes/inquiries"))
app.use("/api/images", require("./routes/images"))

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server is running" })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Error handling middleware
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`DCAR Backend running on port ${PORT}`)
})

module.exports = app
