import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/tap:i18n';
import { check, Match } from 'meteor/check';

import GroupCollection from './groups';

if (Meteor.isServer) {
  Meteor.methods({
    /**
     * @summary Creates a group
     * @isMethod true
     * @param {Object} group - contains all infromation about the group
     *                          (name, description, users, owner
     * @param {Object} languageKey - used to create a notification in the users language
     * @locus Method
     * */
    createGroup(group, languageKey) {
      check(group, {
        name: String,
        description: String,
        users: Array,
        owner: String,
      });
      check(languageKey, String);
      if (!Meteor.userId()) {
        throw new Meteor.Error(500, 'Access denied');
      } else if (group.users.length <= 0) {
        throw new Meteor.Error(500, 'UserArray cannot be empty');
      } else {
        const groupId = GroupCollection.insert({
          name: group.name,
          description: group.description,
          users: group.users,
          owner: group.owner,
        });
        Meteor.call('createNotification', {
          text: TAPi18n.__('notifications.groupInvitation', {}, languageKey) + group.name,
          type: 'groupInvitation',
          owner: { _id: Meteor.userId(), username: Meteor.user().username },
          groupId,
          timestamp: new Date().toISOString(),
          needsConfirmation: true,
          confirmedBy: [Meteor.userId()],
        });
      }
    },
    /**
     * @summary Edits a group
     * @isMethod true
     * @param {Object} group - contains the changed values (name, description, users
     * @locus Method
     * */
    editGroup(group) {
      check(group, {
        name: String,
        description: String,
        users: Array,
      });
      GroupCollection.update(group._id, {
        $set: {
          name: group.name,
          description: group.description,
          users: group.users,
        },
      });
    },
    /**
     * @summary Deletes a group
     * @isMethod true
     * @param {Object} group - contains the id of the group
     * @locus Method
     * */
    deleteGroup(group) {
      check(group, {
        _id: String,
        owner: String,
      });
      if (group.owner !== Meteor.userId()) {
        throw new Meteor.Error(500, 'Access denied');
      } else {
        GroupCollection.remove(group._id);
      }
    },
    /**
     * @summary Validates the userlist of a createGroup request
     * @isMethod true
     * @param {Array} users - contains the userIDs
     * @return {Array} Array of the validated userIds
     * @locus Method
     * */
    validateUsernameList(users) {
      check(users, Array);
      const result = [];
      for (let i = 0; i < users.length; i++) {
        const user = Accounts.findUserByUsername(users[i]);
        if (user) {
          result.push(user._id);
        } else {
          throw new Meteor.Error(500, 'Error 500: Not found', `user with username ${users[i]} not found`);
        }
      }
      return result;
    },
    /**
     * @summary Creates a list of usernames given a list of userIds
     * @isMethod true
     * @param {Array} users - list of userIds
     * @return {Array} Array of usernames
     * @locus Method
     * */
    getIdUsernameList(users) {
      check(users, Array);
      const result = [];
      for (let i = 0; i < users.length; i++) {
        const user = Meteor.users.findOne(users[i], { fields: { username: 1 } });
        if (user) {
          result.push(user.username);
        }
      }
      return result;
    },
    /**
     * @summary Removes a user from a group
     * @isMethod true
     * @param {String} groupId - ID of the group
     * @param {String} userId - ID of the user to be removed
     * @locus Method
     * */
    removeUserFromGroup(groupId, userId) {
      check(groupId, String);
      check(userId, String);
      GroupCollection.update(groupId, {
        $pull: { users: userId },
      });
    },
  });
}
