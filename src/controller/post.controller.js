const db = require('../models/index')

const Post = db.posts
const User = db.users

exports.create = async (req, res) => {
  try {
    const { body, authorName, authorId, image } = req.body

    if (!body) res.status(400).send({ message: 'Body or image is required!' })
    if (!authorName)
      res.status(400).send({ message: 'AuthorName is required!' })
    if (!authorId) res.status(400).send({ message: 'AuthorId is required!' })

    const post = new Post({
      body: body,
      authorName: authorName,
      authorId: authorId,
      image: image,
    })

    post
      .save(post)
      .then((data) => {
        res.send(data)
      })
      .catch((err) => {
        res.status(err.status || 500).send({
          message:
            err.message || 'Some error occurred while creating the post.',
        })
      })
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message || 'Some error occurred while retrieving the posts.',
    })
  }
}

exports.findAll = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.findOne({ _id: userId })

    if (!user)
      res.status(400).send({ message: 'No user found for id provided.' })

    const posts = await Post.find({
      authorId: [...user.friends, user._id],
    }).sort([['updatedAt', 'descending']])

    res.send(posts)
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message || 'Some error occurred while retrieving the posts.',
    })
  }
}

exports.findByUserId = async (req, res) => {
  try {
    const { userId } = req.params
    const posts = await Post.find({ authorId: userId }).sort([
      ['updatedAt', 'descending'],
    ])
    res.send(posts)
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message || 'Some error occurred while retrieving the posts.',
    })
  }
}

exports.delete = async (req, res) => {
  try {
    const response = await Post.deleteOne({ _id: req.params.id })
    return res.json(response)
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message || 'Some error occurred while retrieving the posts.',
    })
  }
}
exports.update = async (req, res) => {
  try {
    const id = req.params.id

    const objectUpdate = req.body
    if (!id) res.status(400).send({ message: 'Missing userId params' })
    if (!objectUpdate) res.status(400).send({ message: 'No fields to update' })

    const doc = await Post.updateOne({ _id: id }, objectUpdate)

    res.send(doc)
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message || 'Some error occurred while retrieving the posts.',
    })
  }
}
