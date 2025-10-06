const express = require('express')
const router = express.Router()
const plannerController = require('../controllers/plannerController')

router.get('/', plannerController.getTasks)
router.post('/', plannerController.createTask)
router.put('/:taskId', plannerController.updateTask)
router.delete('/:taskId', plannerController.deleteTask)

module.exports = router