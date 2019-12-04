const Users = require("../schemas/users");
const Messages = require("../schemas/messages");
const Conversations = require("../schemas/conversations");
const logger = require("../utils/logger");
const mongoose = require("mongoose");

// send a message
const sendMessage = async (userid, messageBody, conversationid) => {
  // param: senders userid
  // param: Message body
  // param: conversationid to add new message to
  // create new message
  const message = new Messages({
    _id: new mongoose.Types.ObjectId(),
    user: userid ? userid : "",
    body: messageBody ? messageBody : ""
  });
  const savedMessage = await message.save().catch(err => {
    logger.error(`Database error in saving message: ${err}`);
  });
  // add messageid to conversation
  const updateConversation = await Conversations.updateOne(
    { _id: conversationid },
    { $push: { messages: message._id } }
  ).catch(err => {
    logger.error(`There was an error updating conversation: ${err}`);
  });
};
