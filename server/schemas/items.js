const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String,  required: true },
  price: { type: Number,  required: true },
  description: { type: String },
  category: { type: String,  required: true },
  photos: [{ type: String }]
});

module.exports = mongoose.model("items", itemSchema);