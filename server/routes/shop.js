const express = require("express");
const upload = require ("../services/file-upload");
const verify = require("./verify-token");

const router = express.Router();
const singleUpload = upload.single('image');

router.post('/image-upload',verify, function(req, res) {
  
  singleUpload(req, res, function(err) {
    if (err) {
      res.status(422).send({errors:[{title: 'File Upload Error', details: err.message}]});
    }
    
    return res.json({'imageUrl': req.file.location});
  })
})

module.exports = router;
