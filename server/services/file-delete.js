const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  region: process.env.BUCKET_REGION
});
const s3 = new aws.S3();

function deleteImage(keysAll){ 
    
    var params = {
        Bucket: process.env.BUCKET_NAME, 
        Delete: { 
          Objects: keysAll // keysAll is array of objects with key: image.jpg
        },
      };
    
    s3.deleteObjects(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     return data          // successful response
  });

}

module.exports = deleteImage;
