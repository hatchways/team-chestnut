const express = require("express");
const router = express.Router();
const User = require("../schemas/users");
const verify = require("./verify-token");
const shops = require("../schemas/shops");

router.get("/welcome", function(req, res, next) {
  res.status(200).send({ welcomeMessage: "Step 1 (completed)" });
});

router.get("/users/:userid", verify, async (req, res, next) => {
  const userid = req.params.userid;
  const token = req.header("auth-token");
  const user = await User.findOne(
    { _id: userid },
    { __v: false, password: false, date: false }
  ).populate("shops");

  if (!user) return res.status(400).send({ message: "User is not found..." });
  console.log("user is:", user);

  const shop = await shops
    .findOne({ user: user._id }, { __v: false, _id: false, user: false })
    .populate("items", "-_id -__v");
  console.log("shop is", shop);

  res
    .header("auth-token", token)
    .status(200)
    .send({ user, shop });
});

module.exports = router;
