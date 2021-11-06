module.exports = (mongoose) => {
  const CommentSchema = new mongoose.Schema(
    {
      // always require all comments to point to the top post, for easy query of all comments whether nested or not
      postId: {
        type: String,
        ref: 'posts',
        required: false,
      },

      parentCommentId: {
        type: String,
        ref: 'comments',
        required: false, // if not populated, then its a top level comment
      },

      authorName: {
        type: String,
        required: true,
      },

      authorId: {
        type: String,
        required: true,
      },
      body: {
        type: String,
        required: true,
      },
    },
    { timestamps: true },
  )

  const Comment = mongoose.model('comment', CommentSchema)
  return Comment
}
