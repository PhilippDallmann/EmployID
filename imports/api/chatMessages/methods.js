import {Meteor} from 'meteor/meteor';
import ChatCollection from "../chats/chats";
import ChatMessageCollection from "./chatMessages";

Meteor.methods({
  /**
   * @summary Creates a chat message
   * @isMethod true
   * @param {Object} message - Contains all information about the message (userId, username, timestamp, text, isBotMessage)
   * @param {String} chatId - ID of the chat it belongs to
   * @locus Method
   * */
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
