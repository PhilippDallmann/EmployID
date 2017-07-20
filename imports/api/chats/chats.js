/**
 * @summary initializes the Chat Collection
 * @param chat_messages - array of all messages inside of the chat
 * @type {SimpleSchema}
 * @locus Collection
 * */

const ChatCollection = new Mongo.Collection("Chats");

let ChatSchema = new SimpleSchema({
  "chat_messages": {
    type: [String]
  }
});

ChatCollection.attachSchema(ChatSchema);

ChatCollection.allow({
  insert: function (userId, doc) {
    return false;
  },
  update: function (userId, doc, fields, modifier) {
    return false;
  },
  remove: function (userId, doc) {
    return false;
  }
});


export default ChatCollection;
