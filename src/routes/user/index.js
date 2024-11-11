const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const { newUser } = require('../../controllers/user.controller')
router.post('/new_user', asyncHandler(newUser))

module.exports = router