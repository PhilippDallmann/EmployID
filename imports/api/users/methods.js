/* global Roles */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  /**
   * @summary Give a user a new set of roles
   * @isMethod true
   * @param {String} userId - ID of the user
   * @param {Array} roles - new roles of the user
   * @locus Method
   * */
  updateRolesOfUser(userId, roles) {
    check(userId, String);
    check(roles, Array);

    const loggedInUser = Meteor.user();
    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, 'Access denied');
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
  updateUserProfile(userId, fieldValueArray) {
    check(userId, String);
    check(fieldValueArray, Array);

    const updateQuery = {};

    fieldValueArray.forEach((element) => {
      updateQuery[element[0]] = element[1];
    });

    Meteor.users.update(userId,
      { $set: updateQuery },
    );
  },
});
