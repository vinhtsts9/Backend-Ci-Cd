const { S3Client, PutObjectCommand, GetObjectCommand, DeleteBucketCommand } = require('@aws-sdk/client-s3')

const config = {
    region: 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESSKEY,
        secretAccessKey: process.env.AWS_BUCKET_SECRETKEY
    }
}
const s3 = new S3Client(config)

module.exports = { s3, PutObjectCommand, GetObjectCommand, DeleteBucketCommand }