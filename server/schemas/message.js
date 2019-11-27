const mongoose = require("mongoose");

let MessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  body: { type: String },
  created_at: { type: Date, default: Date.now },
  seen_by: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }]
});

module.exports = mongoose.model("conversation", MessageSchema);
