const express = require("express");
const upload = require("../services/file-upload");
const deleteImage = require("../services/file-delete");
const verify = require("./verify-token");
const items = require("../schemas/items");
const logger = require("../utils/logger");

const router = express.Router();
const singleUpload = upload.single("image");
const multipleUpload = upload.array("image", 6);

router.post("/image-upload", verify, function(req, res) {
  singleUpload(req, res, function(err) {
    if (err) {
      res.status(422).send({
        errors: [{ title: "File Upload Error", details: err.message }]
      });
    }

    return res.json({ imageUrl: req.file.location });
  });
});

router.post("/item/:itemid", multipleUpload, verify, async (req, res, next) => {
  const itemid = req.params.itemid;
  const token = req.header("auth-token");
  const item = await items.findById(itemid, { __v: false });

  if (!item) return res.status(400).send({ message: "Item not found..." });

  if (req.files) {
    req.files.forEach(file => {     
      if (item.photos.indexOf(file.location) < 0) {
        item.photos.push(file.location);
      } 
    });
  }
    item.title = req.body.title;
    item.price = req.body.price;
    item.description = req.body.description;
    item.category = req.body.category;

    const newItem = await item.save();

    res
      .header("auth-token", token)
      .status(200)
      .send({ item: newItem });
  
});

module.exports = router;
