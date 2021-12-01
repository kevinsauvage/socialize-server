const router = require('express').Router()
const posts = require('../controller/post.controller')
const auth = require('../middleware/auth')

router.post('/posts', auth, posts.create)

router.get('/posts/:userId', auth, posts.findAll)

router.get('/posts/user/:userId', auth, posts.findByUserId)

router.delete('/posts/:id', auth, posts.delete)

router.put('/posts/:id', auth, posts.update)

module.exports = router
