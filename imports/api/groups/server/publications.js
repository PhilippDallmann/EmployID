import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import GroupCollection from '../groups';

if (Meteor.isServer) {
  /**
   * @summary Publishes all Groups the current user is part of
   * @locus Publication
   * */
  Meteor.publish('groupsOfCurrentUser', function groupsOfCurrentUser() {
    return GroupCollection.find({ users: this.userId });
  });
}
/**
 * @summary Publishes all users belonging to a group
 * @param {String} groupId - id of the group
 * @locus Publication
 * */
Meteor.publish('usersOfGroup', function usersOfGroup(groupId) {
  check(groupId, Match.Maybe(String));
  this.autorun(() => {
    const group = GroupCollection.findOne(groupId, { fields: { users: 1 } });

    return Meteor.users.find(
      { _id: { $in: group.users } }, { fields: { _id: 1, username: 1 } },
    );
  });
});
