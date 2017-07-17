import {Meteor} from 'meteor/meteor';

Meteor.methods({
  /**
   * Give a user a new set of roles
   * @param {string} userId - ID of the user
   * @param {array} roles - new roles of the user
   * */
  "updateRolesOfUser": function(userId, roles) {
    var loggedInUser = Meteor.user();
    if(!loggedInUser || !Roles.userIsInRole(loggedInUser, ["admin"])){
      throw new Meteor.Error(403, "Access denied");
    } else {
      Roles.setUserRoles(userId, roles);
    }
  }
});
