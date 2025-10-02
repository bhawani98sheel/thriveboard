const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
})

const File = mongoose.model('File', fileSchema)

// Upload file
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const file = new File({
      user: req.user.userId,
      filename: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size
    })

    await file.save()
    res.status(201).json(file)
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file' })
  }
}

// Get user's files
exports.getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user.userId })
    res.json(files)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files' })
  }
}

// Delete file
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.fileId,
      user: req.user.userId
    })

    if (!file) {
      return res.status(404).json({ message: 'File not found' })
    }

    // Delete file from filesystem
    fs.unlink(file.path, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting file from filesystem' })
      }

      // Delete file document from database
      await File.findByIdAndDelete(file._id)
      res.json({ message: 'File deleted successfully' })
    })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file' })
  }
}

module.exports = { File }