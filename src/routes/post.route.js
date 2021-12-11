const router = require('express').Router()
const posts = require('../controller/post.controller')
const auth = require('../middleware/auth')

router.post('/posts', auth, posts.create)

router.get('/posts', auth, posts.findAll)

router.get('/posts/:postId', auth, posts.findOne)

router.get('/posts/user/:userId', auth, posts.findByUserId)

router.delete('/posts/:id', auth, posts.delete)

router.put('/posts/:postId/dislike', auth, posts.dislike)

router.put('/posts/:postId/like', auth, posts.like)

module.exports = router
