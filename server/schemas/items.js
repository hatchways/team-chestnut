const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String },
  price: { type: Number },
  description: { type: String },
  category: { type: String },
  photos: [{ type: String }]
});

module.exports = mongoose.model("items", itemSchema);