import {Meteor} from 'meteor/meteor';
import {TAPi18n} from 'meteor/tap:i18n';

import GroupCollection from './groups';

if(Meteor.isServer) {
  Meteor.methods({
    /**
     * @summary Creates a group
     * @isMethod true
     * @param {Object) group - contains all infromation about the group (name, description, users, owner
     * @param {Object} languageKey - used to create a notification in the users language
     * */
    createGroup: function(group, languageKey) {
      if(!Meteor.userId()) {
        throw new Meteor.Error(500, "Access denied");
      } else {
        if(group.users.length<=0) {
          throw new Meteor.Error(500, "UserArray cannot be empty");
        } else {
          var groupId = GroupCollection.insert({
            name: group.name,
            description: group.description,
            users: group.users,
            owner: group.owner
          });
          Meteor.call("createNotification", {
            text: TAPi18n.__("notifications.groupInvitation", {}, languageKey) + group.name,
            type: "groupInvitation",
            owner: {_id: Meteor.userId(), username: Meteor.user().username},
            groupId: groupId,
            timestamp: new Date().toISOString(),
            needsConfirmation: true,
            confirmedBy: [Meteor.userId()]
          });
        }
      }
    },
    /**
     * @summary Edits a group
     * @isMethod true
     * @param {Object} group - contains the changed values (name, description, users
     * */
    editGroup: function(group) {
      GroupCollection.update(group._id, {
        $set: {
          name: group.name,
          description: group.description,
          users: group.users
        }
      });
    },
    /**
     * @summary Deletes a group
     * @isMethod true
     * @param {Object} group - contains the id of the group
     * */
    deleteGroup: function(group) {
      if(group.owner!==Meteor.userId()) {
        throw new Meteor.Error(500, "Access denied");
      } else {
        GroupCollection.remove(group._id);
      }
    },
    /**
     * @summary Validates the userlist of a createGroup request
     * @isMethod true
     * @param {Array} users - contains the userIDs
     * @return {Array} Array of the validated userIds
     * */
    validateUsernameList: function(users) {
      var result = [];
      for(var i=0;i<users.length;i++) {
        var user = Accounts.findUserByUsername(users[i]);
        if(user) {
          result.push(user._id);
        } else {
          throw new Meteor.Error(500, 'Error 500: Not found', 'user with username "' + users[i] + '" not found');
        }
      }
      return result;
    },
    /**
     * @summary Creates a list of usernames given a list of userIds
     * @isMethod true
     * @param {Array} users - list of userIds
     * @return {Array} Array of usernames
     * */
    getIdUsernameList: function(users) {
      var result = [];
      for(var i=0;i<users.length;i++) {
        var user = Meteor.users.findOne(users[i], {fields: {username: 1}});
        if(user) {
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
     * */
    removeUserFromGroup: function(groupId, userId) {
      GroupCollection.update(groupId, {
        $pull: {users: userId}
      });
    }
  });
}
