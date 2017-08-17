const Reflux = require('reflux');

const HomeActions = Reflux.createActions([
  'openCreateMeeting',
  'openEditMeeting',
  'openCreateGroup',
  'openEditGroup',
  'createGroup',
  'editGroup',
  'setUserArray',
]);

export default HomeActions;
