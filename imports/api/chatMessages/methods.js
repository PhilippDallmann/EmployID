import {Meteor} from 'meteor/meteor';
import ChatCollection from "../chats/chats";
import ChatMessageCollection from "./chatMessages";

let WPAPI = require('wpapi');

Meteor.methods({
  /**
   *Creates a chat message
   * @param {object} message - contains all information about the message (userId, username, timestamp, text, isBotMessage)
   * @param {string} chatId - id of the chat it belongs to
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

    let wp = new WPAPI({
      endpoint: 'http://localhost/wordpress/wp-json',
      username: 'philipp',
      password: 'Mapex280391',
      auth: true
    });
    wp.posts().then(function( data ) {
      console.log(data);
    }).catch(function( err ) {
      console.log(err);
    });
    wp.users().create({
      username: 'xy',
      email: 'y@y.de',
      password: 'hello'
    }).then(function(response) {
      console.log(response);
    }).catch(function(err) {
      console.log(err);
    });
  }
});
