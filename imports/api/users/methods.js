import {Meteor} from 'meteor/meteor';

Meteor.methods({
  "updateRolesOfUser": function(userId, roles) {
    var loggedInUser = Meteor.user();
    if(!loggedInUser || !Roles.userIsInRole(loggedInUser, ["admin"])){
      throw new Meteor.Error(403, "Access denied");
    } else {
      Roles.setUserRoles(userId, roles);
    }
  }
});
