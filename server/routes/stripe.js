const router = require("express").Router();
const User = require("../schemas/users");
const Order = require("../schemas/orders");
const Address = require("../schemas/address");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");

router.post("/charge", async (req, res, next) => {
  let amount = parseFloat(req.body.total) + (req.body.details.shippingCost ? parseFloat(req.body.details.shippingCost) : 0);

  const chargedCustomer = await stripe.charges.create({
    amount: amount * 100,
    currency: "CAD",
    source: req.body.token
  });

  if (!chargedCustomer) {
    return res.status(400).send({ error: error });
  }

  
  const userId = req.body.user;
  let user;

  logger.log("info", `User id is ${userId}`);
  if (userId) {
    user = await User.findOne(
      { _id: userId },
      { __v: false, password: false, date: false }
    );
    if (!user) return res.status(400).send({ error: "User is not found..." });
    logger.log("info", "The user details is", user.toJSON());
  } else {
    user = await User.findOne(
      { email: req.body.details.email },
      { __v: false, password: false, date: false }
    );
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.NEW_PASSWORD, salt);

      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.details.firstName + " " + req.body.details.lastName,
        email: req.body.details.email,
        password: hashedPassword
      });
      user = await newUser.save();
      if (!user)
        return res
          .status(400)
          .send({ error: "There was inssue, Please try again later" });
    }
  }
  // retrive the billind address
  const savedAddress = await Address.findOne({
    address: req.body.details.address,
    city: req.body.details.city,
    postalCode: req.body.details.zip
  });

  if (!savedAddress) {
    // saving ship address
    const newAddress = new Address({
      user: user._id,
      address: req.body.details.address,
      postalCode: req.body.details.zip,
      city: req.body.details.city,
      country: req.body.details.country,
      phone: req.body.details.phone,
      current: false
    });

    const shipAddress = await newAddress.save().catch(err => {
      logger.error(`the database error in saving address is ${err}`);
    });

    if (!shipAddress) {
      return res
        .status(400)
        .send({ error: "Issue creating this order, please try again later" });
    }
  }
  const orders = [];
  Object.keys(req.body.orders).forEach(ele => {
    orders.push({
      items: ele,
      quantity: req.body.orders[ele]
    });
  });
  // saving the order
  const order = new Order({
    user: user._id,
    totalPrice: amount,
    totalQuanity: req.body.orders.total,
    status: "new-order",
    shipTo: req.body.details.shipping,
    orders,
    receipt_url: chargedCustomer.receipt_url
  });

  const saveOrder = await order.save().catch(err => {
    logger.error(
      `There is a database error in saving the order: error is ${err}`
    );
  });

  if (!saveOrder) {
    return res.status(400).send({ error: "Order was not able to be saved" });
  }

  return res.status(200).send({ success: "Succesfully Charged the client" });
});

module.exports = router;
