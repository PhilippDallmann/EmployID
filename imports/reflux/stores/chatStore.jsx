import { Streamy } from 'meteor/yuukan:streamy';
import ChatActions from '../actions/chatActions';

const Reflux = require('reflux');

class ChatStore extends Reflux.Store {
  constructor() {
    super();
    this.state = {
      typingUserArray: [],
    };
    this.listenables = ChatActions;

    Streamy.on('isTyping', (data) => {
      ChatActions.updateTypingUsers(data.username);
    });
  }
  onUpdateTypingUsers(username) {
    const index = this.state.typingUserArray.indexOf(username);
    if (index === -1) {
      this.state.typingUserArray.push(username);
      ChatActions.deleteArrayItem(this.state.typingUserArray.length - 1);
    }
    this.trigger(this.state);
  }
  onDeleteArrayItem(index) {
    const me = this;
    setTimeout(() => {
      // TODO: check if the long array could be an issue, old version: me.state.typingUserArray.splice(index, 1);
      delete me.state.typingUserArray[index];
      me.trigger(me.state);
    }
      , 3000);
  }
}

export default ChatStore;
