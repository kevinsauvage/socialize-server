const router = require('express').Router()
const comment = require('../controller/comment.controller')
const auth = require('../middleware/auth')

// Create a new COMMENT
router.post('/comment', auth, comment.create)

// Get COMMENT for post ID
router.get('/comment/:postId', auth, comment.getComment)

// Get subcomment for coment ID
router.get('/subComment/:commentId', auth, comment.getSubComment)

// Export API routes
module.exports = router
