/* global Mongo, SimpleSchema */

/**
 * @summary initializes the Chat Collection
 * @param chat_messages - array of all messages inside of the chat
 * @type {SimpleSchema}
 * @locus Collection
 * */

const ChatCollection = new Mongo.Collection('Chats');

const ChatSchema = new SimpleSchema({
  chat_messages: {
    type: [String],
  },
});

ChatCollection.attachSchema(ChatSchema);

ChatCollection.allow({
  insert() {
    return false;
  },
  update() {
    return false;
  },
  remove() {
    return false;
  },
});


export default ChatCollection;
