const db = require('../models/index')
const Notification = db.notification

const Comment = db.comment

exports.create = async (req, res) => {
  const {
    postId,
    parentCommentId,
    authorName,
    authorId,
    body,
    postAuthorId,
  } = req.body

  console.log(req.body)

  if (!body) res.status(400).send({ message: 'Body is required!' })
  if (!authorName) res.status(400).send({ message: 'AuthorName is required!' })
  if (!authorId) res.status(400).send({ message: 'AuthorId is required!' })
  if (!postAuthorId)
    res.status(400).send({ message: 'postAuthorId is required!' })
  if (!postId && !parentCommentId)
    res.status(400).send({ message: 'postId or parentCommentId is required!' })

  const comment = new Comment({
    postId: postId,
    parentCommentId: parentCommentId,
    authorName: authorName,
    authorId: authorId,
    body: body,
  })

  const notification = new Notification({
    type: 'Comment',
    userId: authorId,
    authorId: postAuthorId,
    authorName: authorName,
    postId: postId,
  })

  await notification.save()

  comment
    .save(comment)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the comment.',
      })
    })
}

exports.getComment = async (req, res) => {
  await Comment.find({ postId: req.params.postId })
    .sort([['updatedAt', 'ascending']])
    .then((data) => {
      res.send(data)
    })
}

exports.getSubComment = async (req, res) => {
  await Comment.find({ parentCommentId: req.params.commentId })
    .sort([['updatedAt', 'ascending']])
    .then((data) => {
      res.send(data)
    })
}
