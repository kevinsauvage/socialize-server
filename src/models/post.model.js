module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      authorName: {
        type: String,
        required: true,
      },
      body: {
        type: String,
        required: true,
      },
      authorId: {
        type: String,
        required: true,
      },
      authorAvatar: {
        type: String,
      },

      likes: { type: Number, default: 0 },
      date: { type: Date, default: Date.now },
      image: { type: String },
    },
    { timestamps: true },
  )

  const Posts = mongoose.model('posts', schema)
  return Posts
}
