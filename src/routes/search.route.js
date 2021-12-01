const router = require('express').Router()
const users = require('../controller/user.controller')
const auth = require('../middleware/auth')

router.get('/search', auth, users.search)

router.post('/searchByIds', auth, users.searchByIds)

module.exports = router
