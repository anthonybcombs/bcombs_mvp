import {
    currentS3BucketName,
    uploadFile,
} from "./aws";

import QRCode from 'qrcode';

const formatFile = async (attachment, id, path = "") => {
    const file = { ...(attachment || {}) };
    if (file && file.data) {
        const buf = Buffer.from(
            file?.data.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
        );
        const s3Payload = {
            Bucket: currentS3BucketName,
            Key: `${path}/${id}/${file.filename}`,
            Body: buf,
            ContentEncoding: "base64",
            ContentType: file.contentType,
            ACL: "public-read",
        };
        await uploadFile(s3Payload);
        return s3Payload;
    }
    return null;
};

const generateAndUploadQRCodeToS3 = async (textData, id, path = '') => {
    try {
        // Generate QR code as data URL
        const qrCodeDataURL = await QRCode.toDataURL(textData);

        // Extract the image data part (base64)
        const imageData = qrCodeDataURL.split(',')[1];

        // Convert the base64 image data to a Buffer
        const buffer = Buffer.from(imageData, 'base64');

        const s3Payload = {
            Bucket: currentS3BucketName,
            Key: `${path}/${id}.png`,
            Body: buffer,
            ContentEncoding: "base64",
            ContentType: 'image/png',
            ACL: "public-read",
        };
        await uploadFile(s3Payload);

        return s3Payload;
    } catch (error) {
        console.error('Error uploading QR code to S3:', error);
    }
}

export {
    generateAndUploadQRCodeToS3,
    formatFile
}

