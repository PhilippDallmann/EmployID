import {Meteor} from 'meteor/meteor';
import {Streamy} from 'meteor/yuukan:streamy';

let Reflux = require("reflux");

import ChatActions from "../actions/chatActions";

class ChatStore extends Reflux.Store{
    constructor() {
      super();
      this.state = {
        typingUserArray: []
      };
      this.listenables = ChatActions;

      Streamy.on("isTyping", function(data) {
        ChatActions.updateTypingUsers(data.username);
      });
    }
    onUpdateTypingUsers(username) {
        var index = this.state.typingUserArray.indexOf(username);
        if(index === -1) {
            this.state.typingUserArray.push(username);
            ChatActions.deleteArrayItem(this.state.typingUserArray.length - 1);
        }
        this.trigger(this.state);
    }
    onDeleteArrayItem(index) {
        var me = this;
        setTimeout(function() {
          //TODO: check if the long array could be an issue, old version: me.state.typingUserArray.splice(index, 1);
          delete me.state.typingUserArray[index];
          me.trigger(me.state);
        }
        ,3000);
    }
}

export default ChatStore;