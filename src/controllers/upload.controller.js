const { BadRequestError } = require("../core/error.response")
const { SuccessResponse } = require("../core/success.response")
const {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalFiles,
    uploadImageFromLocalS3} = require("../services/upload.service")

class UploadController { 
    upLoadFile = async (req,res,next) => {
        new SuccessResponse({
            message: 'uploaded success',
            metadata: await uploadImageFromUrl()
        }).send(res)
    }
    upLoadFileThumb = async (req,res,next) => {
        const {file} = req
        if(!file){ 
            throw new BadRequestError('File Missing')
        }
        new SuccessResponse({
            message: 'uploaded success',
            metadata: await uploadImageFromLocal({
                path: file.path
            })
        }).send(res)
    }
    uploadImageFromLocalFiles = async (req,res,next) => {
        const {files} = req
        if(!files){ 
            throw new BadRequestError('File Missing')
        }
        new SuccessResponse({
            message: 'uploaded success',
            metadata: await uploadImageFromLocalFiles({
                files,
                ...req.body
            })
        }).send(res)
    }

    uploadImageFromLocalS3= async (req,res,next) => {
        const {file} = req
        if(!file) {
            throw new BadRequestError('File missing')
        }

        new SuccessResponse({
            message: 'upload successfully',
            metadata: await uploadImageFromLocalS3({
                file
            })
        }).send(res)
    }
}

module.exports = new UploadController()