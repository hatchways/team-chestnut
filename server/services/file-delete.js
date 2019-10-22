const aws = require("aws-sdk");
const logger = require("../utils/logger");

aws.config.update({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  region: process.env.BUCKET_REGION
});

const s3 = new aws.S3();

function deleteImage(keysAll) {
  return new Promise(function(resolve, reject) {
    var params = {
      Bucket: process.env.BUCKET_NAME,
      Delete: {
        Objects: [keysAll] // keysAll is array of objects with capital Key: image.jpg
      }
    };

    s3.deleteObjects(params, function(err, data) {
      if (err) {
        logger.info(`the error  is  ${err}`);
        reject(err);
      } else {
        logger.info(`the delete data is ${data}`);
        resolve(data);
      }
    });
  });
}

module.exports = deleteImage;
