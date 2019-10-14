const router = require("express").Router();
const User = require("../schemas/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import mongoose from 'mongoose';
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  // validate data before
  console.log("i am hitting register end point");
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // check if user already registered in the database
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).send({ message: "Email already registered." });

  // hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // create new user
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });
  try {
    const savedUser = await user.save();
    const token = jwt.sign(
      { _id: savedUser.id, email: savedUser.email, name: savedUser.name },
      process.env.TOKEN_SECRET
    );
    res
      .status(201)
      .header("auth-token", token)
      .send({ token });
  } catch (err) {
    res.status(400).send(err);
  }
});

// login
router.post("/login", async (req, res) => {
  // validate user before
  console.log("i am hitting register login point");
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // check if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({ message: "Email is not found." });
  // password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).send({ message: "Email or password is incorrect." });
  // create and assign token
  const token = jwt.sign(
    { _id: user._id, email: user.email, name: user.name },
    process.env.TOKEN_SECRET
  );
  res.header("auth-token", token).send({ token });
});

module.exports = router;
