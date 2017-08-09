import {Meteor} from 'meteor/meteor';

Meteor.methods({
  /**
   * @summary Give a user a new set of roles
   * @isMethod true
   * @param {String} userId - ID of the user
   * @param {Array} roles - new roles of the user
   * @locus Method
   * */
  "updateRolesOfUser": function(userId, roles) {
    var loggedInUser = Meteor.user();
    if(!loggedInUser || !Roles.userIsInRole(loggedInUser, ["admin"])){
      throw new Meteor.Error(403, "Access denied");
    } else {
      Roles.setUserRoles(userId, roles);
    }
  },
  /**
   * @summary Update a users profile
   * @isMethod true
   * @param {String} userId - ID of the user
   * @param {Array} fieldValueArray - contains the fields to be changed and the corresponding values
   * @locus Method
   * */
  "updateUserProfile": function(userId, fieldValueArray) {
    var update_query = {};
    for (var f in fieldValueArray) {
      update_query[fieldValueArray[f][0]]= fieldValueArray[f][1];
    }

    Meteor.users.update(userId,
      {$set: update_query}
    );
  }
});
