const commentModel = require('../models/comment.model')

class CommentService {
    static async CreateComment({
        comment_productId,comment_userId,comment_content,comment_parentId =null
    }) {
        const comment = await commentModel.create({
            comment_productId,
            comment_userId,
            comment_content,
            comment_parentId
        })

        const CommentParent = await commentModel.findById({comment_parentId})
        
        let rightValue

        if(CommentParent) {
            rightValue = CommentParent.rightValue

            await commentModel.updateMany({comment_productId,comment_right: {$gte: rightValue}}, {$inc: {comment_right:2}})
            await commentModel.updateMany({comment_productId,comment_left: {$gt: rightValue}}, {$inc: {comment_left:2}})
        } else {

            const MaxRightValue = await commentModel.findOne({comment_productId},"comment_right", {$sort:{comment_right:-1}})

            if(MaxRightValue) {
                rightValue = MaxRightValue + 1
            } else {
                rightValue =1 
            }
        }
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        await comment.save()

        return comment
    }

    static async GetCommentByParentId({
        comment_productId,comment_parentId, limit =50,offset=0
    }) {
        const parent = await commentModel.findById(comment_parentId)

        const comments = await commentModel.find({comment_productId},
             {comment_left: {$gt:parent.comment_left},
              comment_right:{$lt:parent.comment_right}}).select({
                comment_left:1,
                comment_right:1,
                comment_productId:1,
                comment_parentId:1
             })
        
        return comments
    }

    static async DeleteComment({
        comment_productId,comment_id
    }) {
        const commentDeleted = await commentModel.findById({comment_id})

        const left = commentDeleted.comment_left
        const right = commentDeleted.comment_right

        const width = right - left + 1

        await commentModel.deletemany({comment_productId}, {comment_left:{$gte:left},comment_right:{$lte: right}})

        await commentModel.updateMany({comment_productId,comment_left:{$gte:right}},{comment_left: {$inc: -width}})
        
        await commentModel.updateMany({comment_productId,comment_right:{$gte:right}},{comment_right: {$inc: -width}})

        return true
    }
}
module.exports = CommentService