const mongoose = require("mongoose");

let shopSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  title: {
    type: String
  },
  description: {
    type: String
  },
  cover_photo: {
    type: String
  },
  items:  [{ type: mongoose.Schema.Types.ObjectId, ref: "items" }],
});

module.exports = mongoose.model("shops", shopSchema);
