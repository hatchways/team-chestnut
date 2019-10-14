import mongoose from "mongoose";

//Users SCHEMA
const usersSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    min: 1,
    max: 255
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6
  },
  date: {
    type: Date,
    default: Date.now
  },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "shops" }
});

module.exports = mongoose.model("users", usersSchema);
