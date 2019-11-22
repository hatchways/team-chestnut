const router = require("express").Router();
const User = require("../schemas/users");
const Order = require("../schemas/orders");
const Address = require("../schemas/address");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const logger = require("../utils/logger");

router.post("/charge", async (req, res, next) => {
  let amount =
    parseFloat(req.body.total) +
    (req.body.details.shippingCost
      ? parseFloat(req.body.details.shippingCost)
      : 0);
  const orders = [];
  Object.keys(req.body.orders).forEach(ele => {
    if (ele !== "total") {
      orders.push({
        item: ele,
        quantity: req.body.orders[ele]
      });
    }
  });

  const userId = req.body.user;
  let user;

  logger.log("info", `User id is ${userId}`);
  if (userId) {
    user = await User.findOne(
      { _id: userId },
      { __v: false, password: false, date: false }
    );
    if (user) {
      logger.log("info", "The user details is", user.toJSON());
      // retrive the billing address
      const savedAddress = await Address.findOne({
        address: req.body.details.address,
        city: req.body.details.city,
        postalCode: req.body.details.zip
      });

      if (!savedAddress) {
        // set a new billing address
        const newAddress = new Address({
          user: user._id,
          address: req.body.details.address,
          postalCode: req.body.details.zip,
          city: req.body.details.city,
          country: req.body.details.country,
          phone: req.body.details.phone,
          current: false
        });

        const billingAddress = await newAddress.save();
        if (!billingAddress) {
          logger.error(
            `Address could not be saved for ${req.body.details.email}`
          );
        }
      }
    }
  }
  // saving the order
  let newOrder;
  if (user) {
    newOrder = new Order({
      user: user._id,
      totalPrice: amount,
      totalQuanity: req.body.orders.total,
      status: "new-order",
      shipTo: req.body.details.shipping,
      orders,
      // receipt_url: chargedCustomer.receipt_url,
      email: req.body.details.email,
      phone: req.body.details.phone
    });
  } else {
    newOrder = new Order({
      totalPrice: amount,
      totalQuanity: req.body.orders.total,
      status: "new-order",
      shipTo: req.body.details.shipping,
      orders,
      // receipt_url: chargedCustomer.receipt_url,
      email: req.body.details.email,
      contact:
        req.body.details.address +
        " " +
        req.body.details.city +
        " " +
        req.body.details.country +
        " " +
        req.body.details.zip,
      phone: req.body.details.phone
    });
  }

  const saveOrder = await newOrder.save().catch(err => {
    logger.error(
      `There is a database error in saving the order: error is ${err}`
    );
  });

  if (!saveOrder) {
    return res.status(400).send({ error: "Order was not able to be saved" });
  }

  const chargedCustomer = await stripe.charges.create({
    amount: amount * 100,
    currency: "CAD",
    source: req.body.token,
    description: `Charge for ${req.body.details.email}`,
    metadata: { order_id: saveOrder._id.toString() },
    receipt_email: req.body.details.email
  });

  if (!chargedCustomer) {
    return res
      .status(400)
      .send({ error: "There was an issue with creating the order." });
  } else {
    await saveOrder.updateOne({ receipt_url: chargedCustomer.receipt_url });
    return res.status(200).send({ success: "Succesfully Charged the client" });
  }
});

module.exports = router;
