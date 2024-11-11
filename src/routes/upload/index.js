const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const  UploadController  = require('../../controllers/upload.controller')
const { uploadDisk, uploadMemory } = require('../../configs/multer.config')
const uploadController = require('../../controllers/upload.controller')

router.post('/product', asyncHandler(UploadController.upLoadFile))

router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(UploadController.upLoadFileThumb))

router.post('/product/multiple', uploadDisk.array('files',3), asyncHandler(UploadController.uploadImageFromLocalFiles))

router.post('/product/bucket', uploadMemory.single('file'), asyncHandler(uploadController.uploadImageFromLocalS3))

module.exports = router