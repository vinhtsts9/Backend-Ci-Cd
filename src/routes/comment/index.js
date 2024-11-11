const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const CommentController = require('../../controllers/comment.controller')

router.post('', asyncHandler(CommentController.createComment))
router.get('', asyncHandler(CommentController.getComment))
router.post('', asyncHandler(CommentController.deleteComment ))

module.exports = router