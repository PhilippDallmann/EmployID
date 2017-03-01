import { Meteor } from 'meteor/meteor';
import GroupCollection from '../groups';

if (Meteor.isServer) {
  Meteor.publish('groupsOfCurrentUser', function () {
    return GroupCollection.find({users: this.userId});
  });
}
Meteor.publish('usersOfGroup', function (groupId) {
  if(groupId) {
    this.autorun(function (computation) {
      var group = GroupCollection.findOne(groupId, {fields: {users: 1}});

      return Meteor.users.find({_id: {$in: group.users}}, {fields: {_id: 1, username: 1}});
    });
  }
});