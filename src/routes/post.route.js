const router = require('express').Router()
const posts = require('../controller/post.controller')

router.post('/posts', posts.create)

router.get('/posts/:userId', posts.findAll)

router.get('/posts/user/:userId', posts.findByUserId)

router.delete('/posts/:id', posts.delete)

router.put('/posts/:id', posts.update)

module.exports = router
