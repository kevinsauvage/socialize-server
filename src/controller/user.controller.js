const db = require('../models/index')
const User = db.users

// Create and Save a new user
exports.create = (req, res) => {
  const { firstName, lastName, email, password } = req.body

  if (!firstName || !lastName || !email || !password) {
    res.status(400).send({ message: 'Content can not be empty!' })
    return
  }

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
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
exports.findOne = (req, res) => {}

// Update a User by the id in the request
exports.update = (req, res) => {}

// Delete a User with the specified id in the request
exports.delete = (req, res) => {}

// Delete all User  from the database.
exports.deleteAll = (req, res) => {}

// Find all published User
exports.findAllPublished = (req, res) => {}
