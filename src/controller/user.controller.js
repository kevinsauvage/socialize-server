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
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the user.',
      })
    })
}

// Login user
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })

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
    res.status(500).send({
      message: error.message || 'Some error occurred while creating the user.',
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
module.exports.isPasswordCorrect = async (
  savedHash,
  savedSalt,
  passwordAttempt,
) => {
  const newHash = await crypto
    .pbkdf2Sync(passwordAttempt, savedSalt, PASSWORD_ITERATIONS, 512, 'sha512')
    .toString('base64')

  console.log('saved', '____________', savedHash)
  console.log('new', '____________', newHash)
  return savedHash === newHash
}

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  return User.find()
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving tutorials.',
      })
    })
}

// Find a single User with an id
exports.findOne = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id })
    res.json(user)
  } catch (error) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving user.',
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
    res.status(500).send({
      message: error.message || 'Some error occurred while updating user.',
    })
  }
}

// Delete a User with the specified id in the request
exports.delete = (req, res) => {}

// Delete all User  from the database.
exports.deleteAll = (req, res) => {}

// Find all published User
exports.findAllPublished = (req, res) => {}
