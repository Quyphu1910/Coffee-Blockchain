// utils/s3.js
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    region: process.env.AWS_REGION, // Ví dụ: 'ap-southeast-1' (Singapore) - cấu hình trong .env
    // Bạn có thể cấu hình thêm các tùy chọn khác nếu cần
});

exports.s3Upload = async (imageBase64, bucketName, imageName) => {
    try {
        const base64Data = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');

        const params = {
            Bucket: bucketName, // Tên bucket S3 của bạn - cấu hình trong .env
            Key: imageName,     // Tên file ảnh trên S3 (ví dụ: productId + timestamp)
            Body: base64Data,
            // ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg' // Hoặc 'image/png', tùy thuộc vào định dạng ảnh
        };

        const uploadedImage = await s3.upload(params).promise();
        return uploadedImage.Location; // Trả về URL công khai của ảnh trên S3

    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw error; // Ném lỗi để controller xử lý
    }
};