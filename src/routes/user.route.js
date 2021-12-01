const router = require('express').Router()
const users = require('../controller/user.controller')
const auth = require('../middleware/auth')

// Create a new User
router.post('/users', users.create)

// login a User
router.post('/login', users.login)

// Retrieve all users from array
router.post('/users/find', auth, users.findAll)

// Retrieve a single User with id
router.get('/users/:id', auth, users.findOne)

// Update a User with id
router.put('/users/:id', auth, users.update)

//Update user password
router.put('/users/:id/password', auth, users.updatePassword)

// Delete a User with id
router.delete('/:id', auth, users.delete)

// Remove from user friends array
router.put('/users/:userId/unfriends/:friendId', auth, users.unfriend)

router.put(
  '/users/:userId/sendAddfriends/:friendId',
  auth,
  users.sendAddfriends,
)

router.put(
  '/users/:userId/unsendAddfriends/:friendId',
  auth,
  users.unsendAddfriends,
)

router.put('/users/:userId/acceptfriend/:friendId', auth, users.acceptFriend)

// Export API routes
module.exports = router
