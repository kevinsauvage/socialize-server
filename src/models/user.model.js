module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      username: String,
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
      country: String,
      birthday: String,
      image: String,
      backgroundImg: String,
      bgProfilPosition: Number,
      phone: String,
      interests: Array,
      friends: Array,
      friendsRequests: Array,
      website: String,
      works: Array,
      educations: Array,
    },
    { timestamps: true },
  )

  const User = mongoose.model('users', schema)
  return User
}
