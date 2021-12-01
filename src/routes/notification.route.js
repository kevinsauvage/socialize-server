const router = require('express').Router()
const notification = require('../controller/notification.controller')
const auth = require('../middleware/auth')

router.post('/notification', auth, notification.create)

router.get('/notification/:userId', auth, notification.getUserNotification)
