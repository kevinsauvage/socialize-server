const db = require('../models/index')
const io = require('../index')
const Post = db.posts
const User = db.users

exports.create = async (req, res) => {
  try {
    const { body, authorId, image, video } = req.body

    if (!body) res.status(400).send({ message: 'Body or image is required!' })

    if (!authorId) res.status(400).send({ message: 'AuthorId is required!' })

    const post = new Post({
      body: body,
      authorId: authorId,
      image: image,
      video: video,
    })

    const response = await post.save()

    const user = await User.findOne({ _id: authorId })

    const posts = await Post.find({
      authorId: [...user.friends, user._id],
    }).sort([['updatedAt', 'descending']])

    console.log(io)

    res.send(response)
    req.app.get('socketService').emiter('post-changed', posts)
    return
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || 'Some error occurred while creating the post.',
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
    return
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
    return
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message || 'Some error occurred while retrieving the posts.',
    })
  }
}

exports.delete = async (req, res) => {
  try {
    const response = await Post.findByIdAndRemove({ _id: req.params.id })

    const user = await User.findOne({ _id: response.authorId })

    const posts = await Post.find({
      authorId: [...user.friends, user._id],
    }).sort([['updatedAt', 'descending']])
    res.json(response)
    req.app.get('socketService').emiter('post-changed', posts)
    return
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

    if (!id) res.status(400).send({ message: 'Missing postId params' })
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
