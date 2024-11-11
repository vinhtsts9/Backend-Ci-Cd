const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name:'vinhts',
    api_key: process.env.API_KEY_CLOUND,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

module.exports = cloudinary