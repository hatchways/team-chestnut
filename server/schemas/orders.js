const mongoose = require("mongoose");

let ordersSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, // if no user need to validate this.
  totalPrice: {
    type: Number,
    required: true
  },
  totalQuanity: {
    type: Number,
    required: true
  },
  status:{
    type: String,
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  orders: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: "items" },
      quantity: { type: Number, required: true }
    }
  ],
  stripeId: {
    type: Number,
  },
  shipTo: { type: String },
  receipt_url: {type: String}
});

module.exports = mongoose.model("orders", ordersSchema);
