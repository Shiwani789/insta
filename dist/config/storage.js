"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.getSignedFileUrl = exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const env_1 = require("./env");
exports.s3Client = new client_s3_1.S3Client({
    region: env_1.env.AWS_REGION,
    credentials: {
        accessKeyId: env_1.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env_1.env.AWS_SECRET_ACCESS_KEY,
    },
});
const getSignedFileUrl = async (key, expiresIn = 3600) => {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: env_1.env.AWS_S3_BUCKET,
        Key: key,
    });
    return await (0, s3_request_presigner_1.getSignedUrl)(exports.s3Client, command, { expiresIn });
};
exports.getSignedFileUrl = getSignedFileUrl;
const deleteFile = async (key) => {
    const command = new client_s3_1.DeleteObjectCommand({
        Bucket: env_1.env.AWS_S3_BUCKET,
        Key: key,
    });
    return await exports.s3Client.send(command);
};
exports.deleteFile = deleteFile;
