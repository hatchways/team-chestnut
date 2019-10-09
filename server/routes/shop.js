import express from "express";
import upload from '../services/file-upload';

const router = express.Router();
const singleUpload = upload.single('image');

router.post('/image-upload', function(req, res) {
  singleUpload(req, res, function(err) {
    if (err) {
      res.status(422).send({errors:[{title: 'File Upload Error', details: err.message}]});
    }
    return res.json({'imageUrl': req.file.location});
  })
})

module.exports = router;
