const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    })
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({
      message: 'File Upload Error',
      error: err.message
    })
  }

  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message
  })
}

module.exports = errorHandler