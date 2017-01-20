import {Meteor} from 'meteor/meteor';
import ChatCollection from "../chats/chats";
import ChatMessageCollection from "./chatMessages";

Meteor.methods({
  "createChatMessage": function(message, chatId) {

    var newMessage = null;

    if(message.isBotMessage && message.isBotMessage == true) {
      newMessage = ChatMessageCollection.insert({
        user_id: message.userId,
        user_name: message.userName,
        timestamp: new Date(),
        text: message.text,
        is_bot_message: true
      });
    } else {
      newMessage = ChatMessageCollection.insert({
        user_id: message.userId,
        user_name: message.userName,
        timestamp: new Date(),
        text: message.text,
        is_bot_message: false
      });
    }

    ChatCollection.update({_id: chatId}, {
      $push: {chat_messages: newMessage}
    })
  }
});
