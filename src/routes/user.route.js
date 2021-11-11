const router = require('express').Router()
const users = require('../controller/user.controller')

// Create a new User
router.post('/users', users.create)

// login a User
router.post('/login', users.login)

// Retrieve all users
router.get('/users', users.findAll)

// Retrieve a single User with id
router.get('/users/:id', users.findOne)

// Update a User with id
router.put('/users/:id', users.update)

//Update user password
router.put('/users/:id/password', users.updatePassword)

// Delete a User with id
router.delete('/:id', users.delete)

// Export API routes
module.exports = router
