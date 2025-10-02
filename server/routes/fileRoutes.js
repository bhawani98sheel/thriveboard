const express = require('express')
const router = express.Router()
const fileController = require('../controllers/fileController')
const upload = require('../middleware/fileUpload')

router.post('/upload', upload.single('file'), fileController.uploadFile)
router.get('/user/:userId', fileController.getUserFiles)
router.delete('/:fileId', fileController.deleteFile)

module.exports = router