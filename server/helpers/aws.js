const AWS = require("aws-sdk");

const currentS3BucketName = "bcombs";
const s3BucketRootPath = "https://bcombs.s3.amazonaws.com/";
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

const s3Bucket = new AWS.S3({
  accessKeyId: "AKIAUCPS6O5Y7TZZTQNG",
  secretAccessKey: "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",
  Bucket: "bcombs",
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


export const deleteFile = (key) => {

  const deleteParams = {
    Bucket: currentS3BucketName,
    Key: key
  };

  return new Promise((resolve, reject) => {
    s3Bucket.deleteObject(deleteParams, function (err, data) {
      if (err) {
        console.log("Error delete data: ", data);
        reject("Error uploading data: ", data);
      } else {
        console.log("succesfully delete the data!");
        resolve("succesfully delete the data!");
      }
    });
  });
}


export { currentS3BucketName, s3Bucket, s3BucketRootPath };
