module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      firstName: String,
      lastName: String,
      email: {
        type: String,
        unique: true,
      },
      password: String,
    },
    { timestamps: true },
  )

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
  })

  const User = mongoose.model('users', schema)
  return User
}
