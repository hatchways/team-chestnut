import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";

aws.config.update({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  region: process.env.BUCKET_REGION
});
const s3 = new aws.S3();
const fileFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid Mime Type, only JPEG and PNG"), false);
  }
};
// Experiencing an error when trying to allow public read access (suggested fixes didn't work)
const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: process.env.BUCKET_NAME,
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});

module.exports = upload;
