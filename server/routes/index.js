var express = require("express");
var router = express.Router();
const User = require("../schemas/users");
const verify = require("./verify-token");

router.get("/welcome", function(req, res, next) {
  res.status(200).send({ welcomeMessage: "Step 1 (completed)" });
});

//get user details along with shop..
router.get("/users/:userid", verify, async (req, res, next) => {
  var userid = req.params.userid;
  const token = req.header("auth-token");

  verify;

  const user = await User.findOne(
    { _id: userid },
    { __v: false, _id: false, password: false, date: false }
  ).populate("shop");

  if (!user) return res.status(400).send({ message: "User is not found..." });
  console.log("user is:", user);

  res
    .header("auth-token", token)
    .status(200)
    .send({ user });
});

module.exports = router;
