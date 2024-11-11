"use strict"

const cloudinary  = require("../configs/cloudianry.config")

const { s3, PutObjectCommand, GetObjectCommand, DeleteBucketCommand } = require('../configs/s3.config')
const { getSignedUrl} = require('@aws-sdk/s3-request-presigner')
const crypto = require('crypto')
const randomImageName = () => crypto.randomBytes(16).toString('hex')
const urlImagePublic = 'http://d8a2rmstbsuu2.cloudfront.net'
const uploadImageFromLocalS3 = async ({
    file
})=> {
    try {
        const imageName = randomImageName()
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
            Body: file.buffer,
            ContentType: 'image/jpeg'
        })
        const result = await s3.send( command )
        const signedUrl = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName
        })
        
        const url = await getSignedUrl(s3,signedUrl, {expiresIn:3600})

        return {
            url: `${urlImagePublic}/${imageName}`
        } 
    } catch (error) {
        console.error(error)
    }
}


const uploadImageFromUrl = async ()=> {
    try {
        const url = 'https://file1.dangcongsan.vn/data/0/images/2023/06/11/upload_2673/2023-06-10t212242z-362653761-up1ej6a1ndsrt-rtrmadp-3-soccer-champions-mci-int-report.jpg?dpi=150&quality=100&w=780'
        const folderName = 'product/shopId', newFileName = 'testdemo'

        const result = await cloudinary.uploader.upload(url, {
            folder: folderName 
        })
        console.log(result)
        return result
    } catch (error) {
        console.error(error)
    }
}

const uploadImageFromLocal = async ({
    path,
    folderName = "product/8409"
})=> {
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id: 'thumb',
            folder: folderName 
        })
        console.log(result)
        return {
            img_url: result.secure_url,
            shopId: 8409,
            thumb_url: await cloudinary.url(result.public_id, {
                height:100,
                width:100,
                format:'jpg'
            })
        }
    } catch (error) {
        console.error(error)
    }
}

const uploadImageFromLocalFiles = async ({
    files,
    folderName = "product/8409"
})=> {
    try {
        if(!files.length) return
        const uploadUrls = []
        for(const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                public_id: 'thumb',
                folder: folderName 
            })

            uploadUrls.push({
                img_url: result.secure_url,
                shopId: 8409,
                thumb_url: await cloudinary.url(result.public_id, {
                    height:100,
                    width:100,
                    format:'jpg'
                })
            })
        }
        return {
            uploadUrls
        }
    } catch (error) {
        console.error(error)
    }
} 


module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalFiles,
    uploadImageFromLocalS3
}