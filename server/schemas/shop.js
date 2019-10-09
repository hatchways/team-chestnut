import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: { type: String },
  price: { type: Number },
  description: { type: String },
  category: { type: String },
  photos: [{ type: String }]
});

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
  items: [itemSchema]
});

module.exports = mongoose.model("shop", shopSchema);
