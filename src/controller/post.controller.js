const db = require('../models/index')

const Post = db.posts

exports.create = async (req, res) => {
  try {
    const { body, authorName, authorId, image, authorAvatar } = req.body

    if (!body) res.status(400).send({ message: 'Body or image is required!' })
    if (!authorName)
      res.status(400).send({ message: 'AuthorName is required!' })
    if (!authorId) res.status(400).send({ message: 'AuthorId is required!' })

    const post = new Post({
      body: body,
      authorName: authorName,
      authorId: authorId,
      image: image,
      authorAvatar: authorAvatar,
    })

    post
      .save(post)
      .then((data) => {
        res.send(data)
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the post.',
        })
      })
  } catch (error) {
    console.log(error)
  }
}

exports.findAll = async (req, res) => {
  try {
    const posts = await Post.find().sort([['updatedAt', 'descending']])
    res.send(posts)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving the posts.',
    })
  }
}

exports.findByUserId = async (req, res) => {
  try {
    const { userId } = req.params
    console.log(userId)
    if (!userId) res.status(400).send({ message: 'userId params is required!' })

    const posts = await Post.find({ authorId: userId }).sort([
      ['updatedAt', 'descending'],
    ])
    res.send(posts)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving the posts.',
    })
  }
}
