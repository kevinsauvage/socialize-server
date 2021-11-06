const router = require('express').Router()
const posts = require('../controller/post.controller')

router.post('/posts', posts.create)

router.get('/posts', posts.findAll)

router.get('/posts/user/:userId', posts.findByUserId)

module.exports = router
