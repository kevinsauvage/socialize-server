const { notification } = require('../models/index')
const db = require('../models/index')
const Notification = db.notification

exports.create = async (req, res) => {
  try {
    console.log(req)
    const notification = new Notification(req.body)
    const response = await notification.save()
    res.send(response)
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message || 'Some error occurred while retrieving the posts.',
    })
  }
}

exports.getUserNotification = async (req, res) => {
  try {
    console.log(req)
    const userId = req.query.userId
    const data = await Notification.find({
      authorId: userId,
    }).sort([['updatedAt', 'descending']])

    res.send(data)
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message || 'Some error occurred while retrieving the posts.',
    })
  }
}
