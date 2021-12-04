module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      body: {
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
      likes: { type: String, default: 0 },
      date: { type: Date, default: Date.now },
      image: { type: String },
      video: { type: String },
    },
    { timestamps: true },
  )

  const Posts = mongoose.model('posts', schema)
  return Posts
}
