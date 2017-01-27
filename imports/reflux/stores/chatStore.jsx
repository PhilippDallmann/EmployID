import {Meteor} from 'meteor/meteor';

let Reflux = require("reflux");

import ChatActions from "../actions/chatActions";

let ChatStore = Reflux.createStore({
    listenables: [ChatActions],
    state: {
        typingUserArray: []
    },
    init: function(flag) {
        Streamy.on("isTyping", function(data) {
            ChatActions.updateTypingUsers(data.username);
        });
    },
    getInitialState: function() {
        return this.state;
    },
    onUpdateTypingUsers: function(username) {
        var index = this.state.typingUserArray.indexOf(username);
        if(index === -1) {
            this.state.typingUserArray.push(username);
            ChatActions.deleteArrayItem(this.state.typingUserArray.length - 1);
        }
        this.trigger(this.state);
    },
    onDeleteArrayItem: function(index) {
        var me = this;
        setTimeout(function() {
          //TODO: check if the long array could be an issue, old version: me.state.typingUserArray.splice(index, 1);
          delete me.state.typingUserArray[index];
          me.trigger(me.state);
        }
        ,3000);
    }
});

export default ChatStore;
