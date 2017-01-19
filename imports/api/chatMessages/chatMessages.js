const ChatMessageCollection = new Mongo.Collection("ChatMessages");

let ChatMessageSchema = new SimpleSchema({
  "user_id": {
    type: String
  },
  "user_name": {
    type: String
  },
  "timestamp": {
    type: Date
  },
  "text": {
    type: String
  },
  is_bot_message: {
    type: Boolean
  }
});

ChatMessageCollection.attachSchema(ChatMessageSchema);

ChatMessageCollection.allow({
  insert: function (userId, doc) {
    return userId;
  },
  update: function (userId, doc, fields, modifier) {
    return false;
  },
  remove: function (userId, doc) {
    return false;
  }
});

export default ChatMessageCollection;