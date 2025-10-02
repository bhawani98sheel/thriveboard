const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')
const plannerRoutes = require('./routes/plannerRoutes')
const fileRoutes = require('./routes/fileRoutes')

// Import middleware
const { authenticateToken } = require('./middleware/auth')
const errorHandler = require('./middleware/errorHandler')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/profile', authenticateToken, profileRoutes)
app.use('/api/planner', authenticateToken, plannerRoutes)
app.use('/api/files', authenticateToken, fileRoutes)

// Error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})