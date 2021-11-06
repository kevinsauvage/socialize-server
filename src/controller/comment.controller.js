const db = require('../models/index')

const Comment = db.comment

exports.create = (req, res) => {
  const { postId, parentCommentId, authorName, authorId, body } = req.body

  if (!body) res.status(400).send({ message: 'Body is required!' })
  if (!authorName) res.status(400).send({ message: 'AuthorName is required!' })
  if (!authorId) res.status(400).send({ message: 'AuthorId is required!' })
  if (!postId && !parentCommentId)
    res.status(400).send({ message: 'postId or parentCommentId is required!' })

  const comment = new Comment({
    postId: req.body.postId,
    parentCommentId: req.body.parentCommentId,
    authorName: req.body.authorName,
    authorId: req.body.authorId,
    body: req.body.body,
  })

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
    .sort([['updatedAt', 'descending']])
    .then((data) => {
      res.send(data)
    })
}

exports.getSubComment = async (req, res) => {
  await Comment.find({ parentCommentId: req.params.commentId })
    .sort([['updatedAt', 'descending']])
    .then((data) => {
      res.send(data)
    })
}
