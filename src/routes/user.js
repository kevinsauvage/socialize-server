const express = require('express')
const userControler = require('../controller/user')

const router = express.Router()
// Getting all user
router.get('/users', (req, res, next) => {
  try {
    const response = userControler.getUsers()
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// Getting one user
router.get('users/:id', (req, res, next) => {
  try {
    const response = userControler.getUserById(req.params.id)
    res.json(response)
  } catch (error) {
    next(error)
  }
})

// Creating one user
router.post('/', (req, res) => {})

// Updating one user
router.patch('/:id', (req, res) => {})

// Deleting one user
router.delete('/:id', (req, res) => {})

// Export API routes
module.exports = router
