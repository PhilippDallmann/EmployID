const Reflux = require('reflux');

const UserActions = Reflux.createActions([
  'login',
  'logout',
  'register',
  'updateUser',
  'updateUserImage',
  'uploadUserImage',
  'findUserByUsername',
  'findAllUsers',
  'setActiveMeeting',
  'unsetActiveMeeting',
]);

module.exports = UserActions;
