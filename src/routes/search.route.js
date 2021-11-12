const router = require('express').Router()
const users = require('../controller/user.controller')

router.get('/search', users.search)

router.post('/searchByIds', users.searchByIds)

module.exports = router
