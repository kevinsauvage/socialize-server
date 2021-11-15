const router = require('express').Router()
const users = require('../controller/user.controller')

// Create a new User
router.post('/users', users.create)

// login a User
router.post('/login', users.login)

// Retrieve all users from array
router.post('/users/find', users.findAll)

// Retrieve a single User with id
router.get('/users/:id', users.findOne)

// Update a User with id
router.put('/users/:id', users.update)

//Update user password
router.put('/users/:id/password', users.updatePassword)

// Delete a User with id
router.delete('/:id', users.delete)

// Remove from user friends array
router.put('/users/:userId/unfriends/:friendId', users.unfriend)

router.put('/users/:userId/sendAddfriends/:friendId', users.sendAddfriends)

router.put('/users/:userId/unsendAddfriends/:friendId', users.unsendAddfriends)

router.put('/users/:userId/acceptfriend/:friendId', users.acceptFriend)

// Export API routes
module.exports = router
