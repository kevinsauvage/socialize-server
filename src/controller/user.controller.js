const db = require('../models/index')
const crypto = require('crypto')
const PASSWORD_ITERATIONS = 10000
const User = db.users
const jwt = require('jsonwebtoken')

// Create and Save a new user
exports.create = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName || !email || !password) {
      const error = new Error('Content can not be empty!')
      error.status = 400
      error.name = 'missingField'
      throw error
    }

    const oldUser = await User.findOne({ email })

    if (oldUser) {
      const error = new Error()
      error.message = 'User email already exist.'
      error.status = 409
      error.name = 'conflit'
      throw error
    }

    const { salt, hash } = this.hashPassword(req.body.password)

    const user = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email.toLowerCase(),
      password: hash,
      salt: salt,
    })

    return user
      .save(user)
      .then((data) => {
        res.send(data)
      })
      .catch((error) => next(error))
  } catch (error) {
    res.status(error.status).send(error)
  }
}

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      const error = new Error('User email not found.')
      error.status = 404
      error.name = 'UserNotFound'
      throw error
    }

    if (!this.isPasswordCorrect(user.password, user.salt, password)) {
      const error = new Error('The password is not correct.')
      error.status = 400
      error.name = 'InvalidPassword'
      error.ok = false
      throw error
    }

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '24h',
      },
    )
    // save user token
    user.token = token

    // return new user
    res.status(201).json(user)
  } catch (error) {
    res.status(error.status || 400).send({
      message: error.message || 'Some error occurred while login the user.',
      name: error.name,
    })
  }
}

// Hash password
// SECURISE PASSWORD

module.exports.hashPassword = (password) => {
  const salt = crypto.randomBytes(128).toString('base64')
  const hash = crypto
    .pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, 512, 'sha512')
    .toString('base64')
  return { salt, hash }
}

// CHECK PASSWORD
module.exports.isPasswordCorrect = (savedHash, savedSalt, passwordAttempt) => {
  const isCorrect =
    savedHash ===
    crypto
      .pbkdf2Sync(
        passwordAttempt,
        savedSalt,
        PASSWORD_ITERATIONS,
        512,
        'sha512',
      )
      .toString('base64')

  return isCorrect
}

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  if (req.body.userFriends) {
    return User.find({ _id: req.body.userFriends })
      .then((data) => {
        res.send(data)
      })
      .catch((error) => {
        res.status(error.status).send({
          message: error.message || 'Some error occurred while finding users.',
          name: error.name,
        })
      })
  } else {
    return User.find()
      .then((data) => {
        res.send(data)
      })
      .catch((error) => {
        res.status(error.status).send({
          message: error.message || 'Some error occurred while finding users.',
          name: error.name,
        })
      })
  }
}

// Find a single User with an id
exports.findOne = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
    res.json(user)
  } catch (error) {
    res.status(error.status).send({
      message: error.message || 'Some error occurred while finding user.',
      name: error.name,
    })
  }
}

// Update a User by the id in the request
exports.update = async (req, res) => {
  try {
    const id = req.params.id

    const objectUpdate = req.body

    if (!id) res.status(400).send({ message: 'Missing userId params' })
    if (!objectUpdate) res.status(400).send({ message: 'No fields to update' })

    const doc = await User.updateOne({ _id: id }, objectUpdate)
    res.send(doc)

    const newUser = await User.findOne({ _id: id })
    req.app.get('socketService').emiter('user-changed', newUser)
    return
  } catch (error) {
    res.send({
      message: error.message || 'Some error occurred while updating user.',
      name: error.name,
    })
  }
}

// Update a User by the id in the request
exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params
    const { newPassword, oldPassword } = req.body

    if (!id) res.status(400).send({ message: 'Missing userId params' })

    if (!newPassword || !oldPassword)
      res.status(400).send({ message: 'Missing field' })

    const user = await User.findOne({ _id: id })

    if (!user) {
      res
        .status(404)
        .send({ message: 'User does not exists', name: 'UserNotFound' })
    }

    if (!this.isPasswordCorrect(user.password, user.salt, oldPassword)) {
      const error = new Error()
      error.status = 400
      error.message = 'User current password is not correct'
      error.name = 'InvalidPassword'
      error.ok = false
      throw error
    }

    const { salt, hash } = this.hashPassword(newPassword)

    const filter = { id: id }

    const oldDocument = await User.updateOne(filter, {
      salt: salt,
      password: hash,
    })

    res.send(oldDocument)
  } catch (error) {
    res.status(error.status).send(error)
  }
}

exports.search = async (req, res) => {
  try {
    const { query } = req.query
    const response = await User.find({
      username: {
        $regex: new RegExp(query, 'i'),
      },
    })

    res.json(response)
  } catch (error) {
    res.status(error.status || 400).send({
      message: error.message || 'Some error occurred while updating user.',
      name: error.name,
    })
  }
}

exports.searchByIds = async (req, res) => {
  try {
    const records = await User.find({ _id: { $in: req.body } })
    res.json(records)
  } catch (error) {
    res.status(error.status || 400).send({
      message: error.message || 'Some error occurred while updating user.',
      name: error.name,
    })
  }
}

exports.unfriend = async (req, res) => {
  try {
    if (!req.params.friendId) {
      res.status(400).send({ message: 'Friend id not  provided' })
    }

    if (!req.params.userId) {
      res.status(400).send({ message: 'User id not  provided' })
    }
    const user = await User.findById(req.params.userId)
    const friend = await User.findById(req.params.friendId)

    if (!user || !friend) {
      res
        .status(400)
        .send({ message: 'User or friend not find with id provided' })
    }

    const newUserFriends = user.friends.filter(
      (id) => id.toString() !== friend._id.toString(),
    )
    const newFriendFriends = friend.friends.filter(
      (id) => id.toString() !== user._id.toString(),
    )

    const doc = await User.updateOne(
      { _id: user._id },
      { friends: newUserFriends },
    )
    const doc2 = await User.updateOne(
      { _id: friend._id },
      { friends: newFriendFriends },
    )

    res.json({ doc_1: doc, doc_2: doc2 })

    const newUser = await User.findOne({ _id: req.params.userId })

    req.app.get('socketService').emiter('user-changed', newUser)

    return
  } catch (error) {
    res.status(error.status || 400).send({
      message: error.message || 'Some error occurred while updating user.',
      name: error.name,
    })
  }
}

exports.sendAddfriends = async (req, res) => {
  try {
    if (!req.params.friendId) {
      res.status(400).send({ message: 'Friend id not  provided' })
    }
    if (!req.params.userId) {
      res.status(400).send({ message: 'User id not  provided' })
    }

    const friend = await User.findById(req.params.friendId)

    if (!friend) {
      res.status(400).send({ message: 'User not find with id provided' })
    }

    const objetToUpdate = {
      friendsRequests: [...friend.friendsRequests, req.params.userId],
    }

    const doc = await User.updateOne({ _id: friend._id }, objetToUpdate)

    res.json(doc)

    const newUser = await User.findOne({ _id: req.params.userId })
    req.app.get('socketService').emiter('user-changed', newUser)
    return
  } catch (error) {
    res.status(error.status || 400).send({
      message: error.message || 'Some error occurred while updating user.',
      name: error.name,
    })
  }
}

exports.unsendAddfriends = async (req, res) => {
  try {
    if (!req.params.friendId) {
      res.status(400).send({ message: 'Friend id not  provided' })
    }

    if (!req.params.userId) {
      res.status(400).send({ message: 'User id not  provided' })
    }

    const friend = await User.findById(req.params.friendId)

    if (!friend) {
      res.status(400).send({ message: 'User not find with id provided' })
    }

    const newFriendsRequests = friend.friendsRequests.filter(
      (id) => id !== req.params.userId,
    )

    const objetToUpdate = {
      friendsRequests: newFriendsRequests,
    }

    const doc = await User.updateOne({ _id: friend._id }, objetToUpdate)
    res.json(doc)

    const newUser = await User.findOne({ _id: req.params.userId })
    req.app.get('socketService').emiter('user-changed', newUser)
    return
  } catch (error) {
    res.status(error.status || 400).send({
      message: error.message || 'Some error occurred while updating user.',
      name: error.name,
    })
  }
}

exports.acceptFriend = async (req, res) => {
  try {
    if (!req.params.friendId) {
      return res.status(400).send({ message: 'Friend id not provided' })
    }

    if (!req.params.userId) {
      return res.status(400).send({ message: 'User id not provided' })
    }
    const user = await User.findById(req.params.userId)
    const friend = await User.findById(req.params.friendId)

    if (!user || !friend) {
      return res
        .status(400)
        .send({ message: 'User or friend not find with id provided' })
    }

    const newUserFriends = [...user.friends, friend._id]

    const newUserFriendsRequests = await user.friendsRequests.filter(
      (id) => !friend._id,
    )

    const objectToUpdate = {
      friends: newUserFriends,
      friendsRequests: newUserFriendsRequests,
    }

    const newFriendFriends = [...friend.friends, user._id]

    const doc = await User.updateOne({ _id: user._id }, objectToUpdate)

    const doc2 = await User.updateOne(
      { _id: friend._id },
      { friends: newFriendFriends },
    )

    if (doc.acknowledged !== true) {
      return res
        .status(400)
        .send({ message: 'We was not able to unfriend you' })
    }

    if (doc2.acknowledged !== true) {
      return res
        .status(400)
        .send({ message: 'We was not able to unfriend you' })
    }

    res.json(doc)
    const newUser = await User.findOne({ _id: req.params.userId })
    req.app.get('socketService').emiter('user-changed', newUser)
    return
  } catch (error) {
    res.status(error.status || 400).send({
      message: error.message || 'Some error occurred while updating user.',
      name: error.name,
    })
  }
}
// Delete a User with the specified id in the request
exports.delete = (req, res) => {}

// Delete all User  from the database.
exports.deleteAll = (req, res) => {}
