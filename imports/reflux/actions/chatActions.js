const Reflux = require('reflux');

const ChatActions = Reflux.createActions([
  'updateTypingUsers',
  'deleteArrayItem',
]);

module.exports = ChatActions;
