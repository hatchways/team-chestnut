const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  region: process.env.BUCKET_REGION
});

const s3 = new aws.S3();

function deleteImage (keysAll) {
    return new Promise(function (resolve, reject) {
    var params = {
        Bucket: process.env.BUCKET_NAME, 
        Delete: { 
          Objects: [ { Key: keysAll}] // keysAll is array of objects with key: image.jpg
        },
      };
    
        s3.deleteObjects(params,function (err, data) {
        if (err) {
            console.log('the error  is ', err); 
            reject(err)
        }
        else {
            console.log('the delete data is ', data);  
            resolve(data)
        }           
      });
    

    });
  };

module.exports = deleteImage;
