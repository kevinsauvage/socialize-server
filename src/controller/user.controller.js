const db = require('../models/index')
const crypto = require('crypto')
const PASSWORD_ITERATIONS = 10000

const User = db.users

// Create and Save a new user
exports.create = async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  if (!firstName || !lastName || !email || !password) {
    res.status(400).send({ message: 'Content can not be empty!' })
    return
  }
  const { salt, hash } = this.hashPassword(req.body.password)

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hash,
    salt: salt,
  })

  return user
    .save(user)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      res.status(error.status).send({
        message: error.message || 'Some error occurred while updating user.',
        name: error.name,
      })
    })
}

// Login user
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    console.log(user)

    if (!user) {
      const error = new Error('User does not exists')
      error.status = 404
      error.name = 'UserNotFound'
      throw error
    }

    if (!this.isPasswordCorrect(user.password, user.salt, req.body.password)) {
      const error = new Error('User password is not correct')
      error.status = 400
      error.name = 'InvalidPassword'
      error.ok = false
      throw error
    }

    res.json(user)
  } catch (error) {
    res.status(error.status).send({
      message: error.message || 'Some error occurred while updating user.',
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
  console.log('hash created', hash)
  return { salt, hash }
}

// CHECK PASSWORD
module.exports.isPasswordCorrect = (savedHash, savedSalt, passwordAttempt) =>
  savedHash ===
  crypto
    .pbkdf2Sync(passwordAttempt, savedSalt, PASSWORD_ITERATIONS, 512, 'sha512')
    .toString('base64')

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  return User.find()
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      res.status(error.status).send({
        message: error.message || 'Some error occurred while updating user.',
        name: error.name,
      })
    })
}

// Find a single User with an id
exports.findOne = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id })
    res.json(user)
  } catch (error) {
    res.status(error.status).send({
      message: error.message || 'Some error occurred while updating user.',
      name: error.name,
    })
  }
}

// Update a User by the id in the request
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const objectUpdate = req.body
    console.log(id, objectUpdate)
    if (!id) res.status(400).send({ message: 'Missing userId params' })
    if (!objectUpdate) res.status(400).send({ message: 'No fields to update' })

    const filter = { id: id }
    const oldDocument = await User.updateOne(filter, objectUpdate)

    res.send(oldDocument)
  } catch (error) {
    res.status(error.status).send({
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

    const user = await User.findOne({ id: id })

    if (!user) {
      const error = new Error('User does not exists')
      error.status = 404
      error.name = 'UserNotFound'
      throw error
    }

    if (!this.isPasswordCorrect(user.password, user.salt, oldPassword)) {
      const error = new Error('User current password is not correct')
      error.status = 400
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
    res.status(error.status).send({
      message: error.message || 'Some error occurred while updating user.',
      name: error.name,
    })
  }
}

// Delete a User with the specified id in the request
exports.delete = (req, res) => {}

// Delete all User  from the database.
exports.deleteAll = (req, res) => {}

// Find all published User
exports.findAllPublished = (req, res) => {}
