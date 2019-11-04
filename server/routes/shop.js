const express = require("express");
const upload = require("../services/file-upload");
const deleteImage = require("../services/file-delete");
const verify = require("./verify-token");
const items = require("../schemas/items");
const logger = require("../utils/logger");
const Shop = require("../schemas/shops");
const mongoose = require("mongoose");

const router = express.Router();
const singleUpload = upload.upload.single("image");
const multipleUpload = upload.upload.array("image", 6);

router.post(
  "/register-shop/:userid",
  singleUpload,
  verify,
  async (req, res, next) => {
    const userid = req.params.userid;
    const token = req.header("auth-token");
    const shop = new Shop({
      user: userid,
      title: req.body.title,
      description: req.body.description,
      cover_photo: req.file ? req.file.location : ""
    });
    const savedshop = await shop.save().catch(err => {
      logger.error(`the database error in saving shop is ${err}`);
    });

    if (!savedshop) {
      return res.status(400).send({ message: "Shop was not able to be saved" });
    }
    return res
      .header("auth-token", token)
      .status(200)
      .send({ shop: savedshop });
  }
);

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

router.post(
  "/new-item/:userid",
  multipleUpload,
  verify,
  async (req, res, next) => {
    const userid = req.params.userid;
    const token = req.header("auth-token");
    // get the store and add then add item

    const shop = await Shop.findOne({ user: userid }, { __v: false }).catch(
      error => {
        logger.error(`the database error in getting the shop ${error}`);
      }
    );
    if (!shop) {
      return res.status(400).send({
        message: "Not authorized to add item, please register a shop"
      });
    }

    logger.log("info", "The shop details is", shop.toJSON());

    const item = new items({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title ? req.body.title : "",
      price: req.body.price ? req.body.price : "",
      description: req.body.description ? req.body.description : "",
      category: req.body.category ? req.body.category : "",
      photos: []
    });

    if (req.files) {
      req.files.forEach(file => {
        item.photos.push(file.location);
      });
    }

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
  }
);
router.put("/details/:userid", verify, async (req, res) => {
  const userid = req.params.userid;
  const token = req.header("auth-token");
  const updateFields = {
    title: req.body.title,
    description: req.body.description
  };
  const shop = await Shop.updateOne(
    { user: userid },
    { $set: updateFields }
  ).catch(error => {
    logger.error(
      `database error in put request to edit shop details: ${error}`
    );
  });
  if (!shop) {
    return res.status(400).send({
      message: "Not authorized to update shop details, please login or register a shop"
    });
  }
  return res
    .header("auth-token", token)
    .status(200)
    .send(shop);
});
router.post("/item/delete-image/:itemid", verify, async (req, res, next) => {
  const itemid = req.params.itemid;
  const token = req.header("auth-token");
  const imageUrl = req.body.image;
  const Key = imageUrl.split("/").slice(-1)[0];
  const imageDeleted = deleteImage({ Key: Key });
  let item = await items.findById(itemid, { __v: false }).catch(err => {
    logger.error(`the database error is ${err}`);
  });
  if (!item) {
    return res.status(400).send({ message: "Item not found..." });
  }

  imageDeleted
    .then((data, rej) => {
      if (data.Deleted[0].Key === Key) {
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
    })
    .catch(err => {
      logger.error(`the multer delete error is ${err}`);
    });
});
router.put("/cover/:userid", verify, singleUpload, async (req, res) => {
  const userid = req.params.userid
  const shop = await Shop.findOne({ user: userid }, { __v: false }).catch(
    error => {
      logger.error(`the database error in getting the shop ${error}`);
      return res.status(400).send({message: "Not authorized to access shop, please login or register a shop"})
    }
  );
  if (!shop) {
    return res.status(400).send({
      message: "Not authorized to access shop, please login or register a shop"
    });
  }
  const oldCoverPhoto = shop.cover_photo
  const updateFields = {
    cover_photo: req.file.location,
  };
  const coverUpdate = await Shop.updateOne(
    { user: userid },
    { $set: updateFields }
  ).catch(error => {
    logger.error(
      `database error in put request to edit shop details: ${error}`
    );
    return res.status(400).send({message: "Not authorized to access update database with new upload"})
  });
  const Key = oldCoverPhoto.split("/").slice(-1)[0];
  const imageDeleted = deleteImage({ Key: Key });
  imageDeleted
    .then((data, rej) => {
      if (data.Deleted[0].Key === Key) {
        return res.status(200).send({message: "Cover photo successfully uploaded and previous photo deleted."})
      } else if (rej) {
        return res
          .status(400)
          .send({ message: "There was an error trying to delete the image" });
      } else {
        return res.status(400).send({ message: "Image could not be deleted" });
      }
    })
    .catch(err => {
      logger.error(`the multer delete error is ${err}`);
    });
})
router.get("/items", async function(req, res) {

  const category = req.query.category ? JSON.parse(req.query.category) : null;
  const priceMax = req.query.priceMax ? req.query.priceMax : null;
  const priceMin = req.query.priceMin ? req.query.priceMin : null;
  logger.info(`the params are category ${category} pricemax ${priceMax} pricemin  ${priceMin} `);
  if (category === null && priceMax === null && priceMin === null) {
    const allItems = await items.find().catch(error => {
      logger.error(`the database error is ${error}`);
    });
    if (!allItems) {
      return res
        .status(400)
        .send({ message: "There was an error getting the item" });
    } else {
      logger.info(`the data without params is ${allItems}`);
      return res.status(200).send(allItems);
    }
  } else {
    let filter 
    if (category == null) {
       filter = { price: { $gt: priceMin, $lt: priceMax }}
    } else {
      filter = {
        price: { $gt: priceMin, $lt: priceMax },
        category: { $in: category }
      }
    }
    const allItems = await items
      .find(filter)
      .catch(error => {
        logger.error(`the database error is ${error}`);
      });
    if (!allItems) {
      return res
        .status(400)
        .send({ message: "There was an error getting the item" });
    } else {
      logger.info(`the data  is ${allItems}`);
      return res.status(200).send(allItems);
    }
  }
});

module.exports = router;
