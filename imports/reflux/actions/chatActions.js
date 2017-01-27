let Reflux = require("reflux");

let ChatActions = Reflux.createActions([
    "updateTypingUsers",
    "deleteArrayItem"
]);

module.exports = ChatActions;
