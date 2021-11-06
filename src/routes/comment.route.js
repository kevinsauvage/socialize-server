const router = require('express').Router()
const comment = require('../controller/comment.controller')

// Create a new COMMENT
router.post('/comment', comment.create)

// Get COMMENT for post ID
router.get('/comment/:postId', comment.getComment)

// Get subcomment for coment ID
router.get('/subComment/:commentId', comment.getSubComment)

// Export API routes
module.exports = router
