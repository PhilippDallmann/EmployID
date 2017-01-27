let Reflux = require("reflux");

let UserActions = Reflux.createActions([
    "login",
    "logout",
    "register",
    "updateUser",
    "updateUserImage",
    "uploadUserImage",
    "findUserByUsername",
    "findAllUsers",
    "setActiveMeeting",
    "unsetActiveMeeting"
]);

module.exports = UserActions;
