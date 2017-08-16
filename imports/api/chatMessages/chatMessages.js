/* global Mongo, SimpleSchema */

/**
 * @summary initializes the ChatMessage Collection
 * @param user_id - id of the sender
 * @param user_name - name of the sender
 * @param timestamp - timestamp of message creation
 * @param text - value of the message
 * @param is_bot_message - Defines whether the message is automatically generated or user generated
 * @type {SimpleSchema}
 * @locus Collection
 * */

const ChatMessageCollection = new Mongo.Collection('ChatMessages');

const ChatMessageSchema = new SimpleSchema({
  user_id: {
    type: String,
  },
  user_name: {
    type: String,
  },
  timestamp: {
    type: Date,
  },
  text: {
    type: String,
  },
  is_bot_message: {
    type: Boolean,
  },
});

ChatMessageCollection.attachSchema(ChatMessageSchema);

ChatMessageCollection.allow({
  insert(userId) {
    return userId;
  },
  update() {
    return false;
  },
  remove() {
    return false;
  },
});

export default ChatMessageCollection;
