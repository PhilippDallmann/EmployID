import { Meteor } from 'meteor/meteor';
import AdminActions from '../actions/adminActions';

const Reflux = require('reflux');

const AdminStore = Reflux.createStore({
  listenables: [AdminActions],
  onSaveRoleChanges(userId, roleValuePairs) {
    const roles = [];
    for (let i = 0; i < roleValuePairs.length; i += 1) {
      roles[i] = roleValuePairs[i].value;
    }
    Meteor.call('updateRolesOfUser', userId, roles);
  },
});

export default AdminStore;
