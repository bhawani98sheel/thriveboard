const jwt = require('jsonwebtoken')
const User = require('../models/User')
const config = require('../config/config')

// Register new user
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create new user
    const user = new User({ email, password })
    await user.save()

    // Generate token
    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET)

    res.status(201).json({ token })
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' })
  }
}

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET)

    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' })
  }
}