const AWS = require("aws-sdk");

const currentS3BucketName = "bcombs-dev";
const s3BucketRootPath = "https://bcombs-dev.s3.amazonaws.com/";
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

const s3Bucket = new AWS.S3({
  accessKeyId: "AKIAR3ORYVVFKTTPNTOF",
  secretAccessKey: "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",
  Bucket: "bcombs-dev",
  region: "us-east-1",
});
export const uploadFile = (data) => {
  return new Promise((resolve, reject) => {
    s3Bucket.putObject(data, function (err, data) {
      if (err) {
        console.log("Error uploading data: ", data);
        reject("Error uploading data: ", data);
      } else {
        console.log("succesfully uploaded the image!");
        resolve("succesfully uploaded the image!");
      }
    });
  });
};
export { currentS3BucketName, s3Bucket, s3BucketRootPath };
