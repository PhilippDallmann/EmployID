import { Meteor } from 'meteor/meteor';
import GroupCollection from '../groups';

if (Meteor.isServer) {
  Meteor.publish('groupsOfCurrentUser', function () {
    return GroupCollection.find({users: this.userId});
  });
}