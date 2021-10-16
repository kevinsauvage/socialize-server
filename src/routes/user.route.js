const router = require('express').Router()
const users = require('../controller/user.controller')

// Create a new User
router.post('/users', users.create)

// Retrieve all users
router.get('/users', users.findAll)

// Retrieve a single User with id
router.get('/:id', users.findOne)

// Update a User with id
router.put('/:id', users.update)

// Delete a User with id
router.delete('/:id', users.delete)

// Export API routes
module.exports = router
