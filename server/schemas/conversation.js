const mongoose = require("mongoose");

let ConversationSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "message" }],
  created_at: { type: Date, default: Date.now },
  seen_by: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }]
});

module.exports = mongoose.model("conversation", ConversationSchema);
