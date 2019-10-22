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
  // need to authenticate the user authorization to the shop
  const item = await items.findById(itemid, { __v: false }).catch(err => {
    logger.error(`the database error is ${err}`);
  });
  if (!item) {
    return res.status(400).send({ message: "Item not found..." });
  }
  if (req.files) {
    req.files.forEach(file => {
      if (item.photos.indexOf(file.location) < 0) {
        item.photos.push(file.location);
      }
    });
  }
  item.title = req.body.title ? req.body.title : item.title;
  item.price = req.body.price ? req.body.price : item.price;
  item.description = req.body.description
    ? req.body.description
    : item.description;
  item.category = req.body.category ? req.body.category : item.category;

  const newItem = await item.save().catch(error => {
    logger.error(`the database error is ${error}`);
  });
  if (!newItem) {
    return res
      .status(400)
      .send({ message: "There was an error saving the item" });
  }
  logger.info(`the newitem is ${newItem}`);
  return res
    .header("auth-token", token)
    .status(200)
    .send({ item: newItem });
});

router.post("/item/delete-image/:itemid", verify, async (req, res, next) => {
  const itemid = req.params.itemid;
  const token = req.header("auth-token");
  const imageUrl = req.body.image;
  const Key = imageUrl.split("/").slice(-1)[0];
  const imageDeleted = deleteImage({ Key });
  let item = await items.findById(itemid, { __v: false }).catch(err => {
    logger.error(`the database error is ${err}`);
  });
  if (!item) {
    return res.status(400).send({ message: "Item not found..." });
  }

  imageDeleted.then((data, rej) => {
    if (data.Deleted[0].Key === key) {
      item.photos = item.photos.filter(url => {
        return url !== imageUrl;
      });
      item.save().then((response, error) => {
        if (response) {
          return res
            .header("auth-token", token)
            .status(200)
            .send({ message: "Image deleted" });
        } else if (error) {
          return res.status(400).send({ message: error.message });
        }
      });
    } else if (rej) {
      return res
        .status(400)
        .send({ message: "There was an error trying to delete the image" });
    } else {
      res.status(400).send({ message: "Image could not be deleted" });
    }
  });
});

module.exports = router;
