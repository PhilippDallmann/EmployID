import {Meteor} from 'meteor/meteor';
let Reflux = require("reflux");

import AdminActions from "../actions/adminActions";

let AdminStore = Reflux.createStore({
    listenables: [AdminActions],
    onSaveRoleChanges: function(userId, roleValuePairs) {
      var roles = [];
      for(var i = 0;i<roleValuePairs.length;i++) {
        roles[i] = roleValuePairs[i].value;
      }
      Meteor.call("updateRolesOfUser", userId, roles);
    }
});

export default AdminStore;
