module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      firstName: String,
      lastName: String,
      email: {
        type: String,
        unique: true,
        require: true,
      },
      password: {
        type: String,
        require: true,
      },
      salt: String,
      about: String,
      city: String,
      birthday: Date,
      image: String,
      backgroundImg: String,
      bgProfilPosition: Number,
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