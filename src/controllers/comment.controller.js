const { CreateComment } = require('../services/comment.service')
const { SuccessResponse } = require('../core/success.response')

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful create comment',
            metadata: await CreateComment(req.body)
        }).send(res)
    }
    getComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful create comment',
            metadata: await CommentService.GetCommentByParentId(req.query)
        }).send(res)
    }
    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful create comment',
            metadata: await CommentService.DeleteComment(req.body)
        }).send(res)
    }
}
module.exports =  new CommentController()