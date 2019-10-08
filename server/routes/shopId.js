const Busboy = require("busboy");
const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const verify = require('./verifyToken');

function uploadToS3(file) {
  let s3bucket = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET,
    Bucket: process.env.BUCKET_NAME
  });
  let imageData;
  s3bucket.createBucket(function() {
    let params = {
      Bucket: process.env.BUCKET_NAME,
      Key: file.name,
      Body: file.data
    };
    s3bucket.upload(params, function(err, data) {
      if (err) {
        console.log("error in callback");
        console.log(err);
      }
      console.log("Image successfully sent to S3.");
      imageData = data;
    });
  });
  return imageData;
}

router.put("/image-upload", verify, (req, res) => {
  var busboy = new Busboy({ headers: req.headers });

  // The file upload has completed
  busboy.on("finish", function() {
    console.log("Image upload complete!");
    res.status(200).send({ response: `Image upload completed.` });

    // Grabs your file object from the request.
    const file = req.files.image;

    // Begins the upload to the AWS S3
    const imageData = uploadToS3(file);
    // to do: store image url in database
    console.log(imageData);
  });

  req.pipe(busboy);
});
router.put("/details", verify, (req, res) => {
  res.status(200).send({response: 'details api successfully called'});
  // to do: store the shop details
  console.log(req.body);
});
module.exports = router;
