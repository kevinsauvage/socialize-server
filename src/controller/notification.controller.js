const db = require('../models/index')
const Notification = db.notification

exports.create = async (req, res) => {
  try {
    console.log(req)
    const notification = new Notification(req.body)
    const response = await notification.save()
    console.log(response)
    res.json(response)
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message || 'Some error occurred while retrieving the posts.',
    })
  }
}

exports.getUserNotification = async (req, res) => {
  try {
    const userId = req.params.userId
    let limit = req.query.limit

    const data = await Notification.find({
      authorId: userId,
      userId: { $ne: userId },
    })
      .sort([['createdAt', 'descending']])
      .limit(parseInt(limit))

    const count = await Notification.find({
      authorId: userId,
      userId: { $ne: userId },
    }).count()

    res.json({ data: data, count: count })
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message || 'Some error occurred while retrieving the posts.',
    })
  }
}

exports.updateNotification = async (req, res) => {
  try {
    const id = req.params.id
    const objectUpdate = req.body
    console.log(objectUpdate)
    console.log(id)

    const doc = await Notification.updateOne({ _id: id }, objectUpdate)
    console.log(doc)
    res.json(doc)
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message || 'Some error occurred while retrieving the posts.',
    })
  }
}
