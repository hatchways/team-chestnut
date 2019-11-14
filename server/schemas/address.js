const mongoose = require("mongoose");

let addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  address: { type: String },
  postalCode: { type: String },
  city: { type: String },
  country: { type: String },
  phone: { type: String },
  current: {type: Boolean}
});

module.exports = mongoose.model("addresses", addressSchema);
