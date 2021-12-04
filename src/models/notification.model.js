module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
      },
      authorId: {
        type: String,
        required: true,
      },
      authorName: {
        type: String,
        required: true,
      },
      postId: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      consulted: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true },
  )

  const Notification = mongoose.model('notification', schema)
  return Notification
}
