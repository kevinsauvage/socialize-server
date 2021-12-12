const db = require('../models/index')
const Post = db.posts
const User = db.users
const Notification = db.notification

exports.create = async (req, res) => {
  try {
    const { body, authorId, image, video, authorName } = req.body

    if (!body) res.status(400).send({ message: 'Body or image is required!' })

    const post = new Post({
      body: body,
      authorId: authorId,
      authorName: authorName,
      image: image,
      video: video,
    })

    const response = await post.save()

    res.send(response)
    return
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || 'Some error occurred while creating the post.',
    })
  }
}

exports.findOne = async (req, res) => {
  try {
    const { postId } = req.params
    const post = await Post.findOne({ _id: postId })
    res.send(post)
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message || 'Some error occurred while retrieving the posts.',
    })
  }
}

exports.findAll = async (req, res) => {
  try {
    let { limit, userId } = req.query

    const user = await User.findOne({ _id: userId })
    console.log(limit)
    if (!user)
      res.status(400).send({ message: 'No user found for id provided.' })

    const posts = await Post.find({
      authorId: [...user.friends, user._id],
    })
      .sort([['createdAt', 'descending']])
      .limit(parseInt(limit))

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
    const { limit } = req.query

    const posts = await Post.find({ authorId: userId })
      .sort([['createdAt', 'descending']])
      .limit(parseInt(limit))

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

    res.json(response)
    return
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message || 'Some error occurred while retrieving the posts.',
    })
  }
}

exports.dislike = async (req, res) => {
  try {
    const id = req.params.postId
    const { userId } = req.body

    if (!userId) return res.status(401).json({ message: 'Missing userId' })

    const post = await Post.findOne({ _id: id })

    const response = await Post.updateOne(
      { _id: id },
      { likes: parseInt(post.likes) - 1 },
    )

    if (response.modifiedCount === 0)
      res
        .status(400)
        .send({ error: 'We could not unlike the post, please try again.' })

    const user = await User.findOne({ _id: userId })
    const newLikedPost = await user.likedPost.filter((item) => item !== id)

    await User.updateOne({ _id: userId }, { likedPost: newLikedPost })

    const newUser = await User.findOne({ _id: userId })

    const newPost = await Post.findOne({ _id: id })

    res.json(newPost)
    req.app.get('socketService').emiter('user-changed', newUser)
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message || 'Some error occurred while retrieving the posts.',
    })
  }
}

exports.like = async (req, res) => {
  try {
    const id = req.params.postId
    const { userId } = req.body

    if (!userId) return res.status(401).json({ message: 'Missing userId' })

    const post = await Post.findOne({ _id: id })

    const response = await Post.updateOne(
      { _id: id },
      { likes: parseInt(post.likes) + 1 },
    )

    if (response.modifiedCount === 0)
      res
        .status(400)
        .send({ error: 'We could not like the post, please try again.' })

    const user = await User.findOne({ _id: userId })

    const newLikedPost = [...user.likedPost, id]

    await User.updateOne({ _id: userId }, { likedPost: newLikedPost })

    const notification = new Notification({
      type: 'Like',
      userId: user._id,
      authorId: post.authorId,
      authorName: user.username,
      postId: post._id,
    })

    await notification.save()

    const newPost = await Post.findOne({ _id: id })

    const newUser = await User.findOne({ _id: userId })

    res.json(newPost)
    req.app.get('socketService').emiter('user-changed', newUser)
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message || 'Some error occurred while retrieving the posts.',
    })
  }
}
